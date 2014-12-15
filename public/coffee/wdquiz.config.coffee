wdquiz.config = do() ->
  baseUrl = '/api/'
  return {
    api:
      answerableQuestionUrl: "#{baseUrl}answerableQuestion/"
      answerUrl: "#{baseUrl}answer/"
      contestUrl: "#{baseUrl}contest/"
      entryUrl: "#{baseUrl}entry/"
      questionUrl: "#{baseUrl}question/"
  }
