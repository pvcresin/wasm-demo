import saveAs from 'file-saver';

const $input = document.querySelector('[data-js="input"]');
const $list = document.querySelector('[data-js="list"]');
const $template = document.querySelector('[data-js="list-item-template"]');

async function readFile(file) {
  const ab = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => resolve(reader.result));
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(file);
  });
  return new Uint8Array(ab);
}

function extractFile(zipReader, filename) {
  const buffer = zipReader.getBinary(filename);
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const basename = filename.split('/').pop();
  saveAs(blob, basename);
}

async function loadZip(ev) {
  const wasm = await import('./crate/pkg');

  const file = ev.target.files[0];
  if (!file) {
    return false;
  }
  ev.target.toggleAttribute('disabled', true);

  const buffer = await readFile(file);
  const zipReader = new wasm.ZipReader(buffer);
  const filenameList = zipReader.getFilenameList();

  console.log(filenameList);

  for (const filename of filenameList) {
    const $item = document.importNode($template.content, true);
    const $filename = $item.querySelector('[data-js="filename"]');
    const $extract = $item.querySelector('[data-js="extract-button"]');

    $filename.textContent = filename;
    $extract.addEventListener('click', () => {
      $extract.toggleAttribute('disabled', true);
      extractFile(zipReader, filename);
      $extract.toggleAttribute('disabled', false);
    });

    $list.appendChild($item);
  }
}

$input.addEventListener('change', loadZip);
