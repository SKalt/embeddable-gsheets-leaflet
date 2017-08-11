export default const linkToId = (link) => link
  .replace(/.*\/d\//, '')
  .replace(/\/edit.+/, '');
