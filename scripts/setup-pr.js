// eslint-disable-next-line node/no-unpublished-require
const commitTypes = require('conventional-commit-types');
const { argv = [] } = process;

const commits = (argv.join(' ') || '')
  .trim()
  // .replace(/\+\s/g, '')
  .split(/\+\s/g)
  // .split(/\n/g)
  .filter(message => /:/.test(message))
  .map(message => {
    const [hashTypeScope, ...description] = message.split(/:/);
    const [hash, typeScope = ''] = hashTypeScope.split(/\s/);
    const [type, scope = ''] = typeScope.split('(');
    return {
      hash,
      typeScope,
      type,
      scope: scope.split(')')[0],
      description: description.join(' ').trim()
    };
  })
  .filter(obj => obj.type in commitTypes.types)
  .map(obj => ({ ...obj, typeLabel: commitTypes.types[obj.type].title }))
  .reduce((groups, obj) => {
    if (!groups[obj.typeLabel]) groups[obj.typeLabel] = [];
    groups[obj.typeLabel].push(`- **${obj.scope}** ${obj.description} (${obj.hash})`);
    return groups;
  }, {});

let output = '';

Object.keys(commits).forEach(commitType => {
  output += `\n### ${commitType}\n`;
  output += commits[commitType].join('\n');
  output += '\n';
});

console.log(output.replace(/%/g, '%25').replace(/\n/g, '%0A'));
// console.log(output);
