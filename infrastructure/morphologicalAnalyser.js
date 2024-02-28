const kuromoji = require('kuromoji');

class MorphologicalAnalyser {
  constructor(tokenizer) {
    this.tokenizer = tokenizer;
  }
  analyse(text) {
    return this.tokenizer.tokenize(text);
  }
}

const buildAnalyser = () => {
  const dictionaryDir = "node_modules/kuromoji/dict";

  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: dictionaryDir }).build((err, tokenizer) => {
      if (err) {
        reject(err);
      } else {
        resolve(new MorphologicalAnalyser(tokenizer));
      }
    });
  });
};

module.exports = { buildAnalyser };
