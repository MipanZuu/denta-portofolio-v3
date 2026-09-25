const TYPES = [
  ["feat", "A new feature"],
  ["fix", "A bug fix"],
  ["docs", "Documentation only"],
  ["style", "Formatting without a code change"],
  ["refactor", "A code change that is neither a feature nor a fix"],
  ["perf", "A performance improvement"],
  ["test", "Adding or correcting tests"],
  ["build", "Build system or dependency changes"],
  ["ci", "Continuous integration changes"],
  ["chore", "Other maintenance work"],
  ["revert", "Revert a previous commit"],
];

const clean = (value) => value.trim().replace(/\.+$/, "");

module.exports = {
  prompter(cz, commit) {
    return cz
      .prompt([
        {
          type: "list",
          name: "type",
          message: "Select the type of change that you're committing:",
          choices: TYPES.map(([type, description]) => ({
            name: `${type.padEnd(9)} ${description}`,
            value: type,
          })),
        },
        {
          type: "input",
          name: "subject",
          message: (answers) =>
            `Write a short, imperative tense description of the change (max ${100 - answers.type.length - 2} chars):\n`,
          filter: clean,
          validate(value, answers) {
            const subject = clean(value);
            const maximum = 100 - answers.type.length - 2;
            if (!subject) return "Description is required";
            if (subject.length > maximum)
              return `Description must be ${maximum} characters or fewer`;
            return true;
          },
        },
        {
          type: "input",
          name: "body",
          message:
            "Provide a longer description of the change: (press enter to skip)\n",
        },
        {
          type: "confirm",
          name: "isBreaking",
          message: "Are there any breaking changes?",
          default: false,
        },
        {
          type: "input",
          name: "breaking",
          message: "Describe the breaking changes:\n",
          when: ({ isBreaking }) => isBreaking,
          validate: (value) =>
            value.trim().length > 0 || "Describe the breaking change",
        },
        {
          type: "confirm",
          name: "hasIssues",
          message: "Does this change affect any open issues?",
          default: false,
        },
        {
          type: "input",
          name: "issues",
          message: 'Add issue references (for example "fix #123"):\n',
          when: ({ hasIssues }) => hasIssues,
        },
      ])
      .then((answers) => {
        const message = [`${answers.type}: ${answers.subject}`];

        if (answers.body.trim()) message.push(answers.body.trim());
        if (answers.breaking?.trim())
          message.push(`BREAKING CHANGE: ${answers.breaking.trim()}`);
        if (answers.issues?.trim()) message.push(answers.issues.trim());

        commit(message.join("\n\n"));
      });
  },
};
