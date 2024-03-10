module.exports = {
  parserOpts: {
    headerPattern: /(fix|feat|chore|refactor):\s\[.*-\d*\]:/,
    headerCorrespondence: ['type', 'ticket', 'subject']
  }
};
