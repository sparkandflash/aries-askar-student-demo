//const forbiddenWords = ["spam", "money"];
export function sampleMiddleware({ dispatch }) {
    return function (next) {
      return function (action) {
        // do your stuff
       /*  const foundWord = forbiddenWords.filter(word =>
          action.payload.title === word
        );
        if (foundWord.length) {
          return dispatch({ type: "FOUND_BAD_WORD" });
        } */
        return next(action);
      };
    };
  }