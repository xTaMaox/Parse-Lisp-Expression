function evaluate(expr: string, vars: Record<string, number> = {}) {
  const evalWord = (word: string) => {
    return evaluate(word, { ...vars });
  };

  if (expr[0] === "(") {
    expr = expr.slice(1, -1);
  }

  const words = getWords(expr);
  const fn = words.next().value;
  let word1 = words.next();
  let word2 = words.next();

  switch (fn) {
    case "let": {
      while (!word2.done) {
        vars[word1.value] = evalWord(word2.value);
        word1 = words.next();
        word2 = words.next();
      }
      return evalWord(word1.value);
    }
    case "mult": {
      return evalWord(word1.value) * evalWord(word2.value);
    }
    case "add": {
      return evalWord(word1.value) + evalWord(word2.value);
    }
  }

  return fn in vars ? vars[fn] : Number(fn);
}

function* getWords(expr: string) {
  let open = 0;
  let word = "";
  for (const c of expr) {
    word += c;
    switch (c) {
      case "(": {
        open++;
        break;
      }
      case ")": {
        open--;
        break;
      }
      case " ": {
        if (!open) {
          yield word.slice(0, -1);
          word = "";
        }
        break;
      }
    }
  }
  yield word;
  return "";
}
