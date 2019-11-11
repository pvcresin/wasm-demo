const $input = document.querySelector('[data-js="input"]');
const $list = document.querySelector('[data-js="list"]');
const $template = document.querySelector('[data-js="list-item-template"]');

$input.addEventListener('change', loadZip);

async function readFile(file) {
  const ab = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => resolve(reader.result));
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(file);
  });
  return new Uint8Array(ab);
}

async function loadZip(ev) {
  const wasm = await import('./crate/pkg');

  const file = ev.target.files[0];
  if (!file) {
    return false;
  }
  ev.target.toggleAttribute('disabled', true);

  const buffer = await readFile(file);
  console.log(wasm.getFilenameList(buffer));
}
