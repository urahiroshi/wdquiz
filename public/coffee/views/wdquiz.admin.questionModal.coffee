wdquiz.admin.questionModal = wdquiz.admin.ItemView.extend
  # ---- properties ----
  template: JST["wdquiz.admin.question.modal.jst"]
  _effect: "question-effect"
  events:
    "click #addChoice": "onClickAddChoice"
    "click .deleteChoice": "onClickDeleteChoice"
    "click #saveQuestion": "onClickSaveQuestion"
    "click #closeQuestion": "onClickCloseQuestion"
  # ---- private methods ----
  _input2Question: ->
    question = {choices: []}
    $("input").each ->
      idMatcher = @id.match(/question\-(.*)/)
      if (idMatcher)
        key = idMatcher[1]
        choiceMatcher = key.match(/choice(\d+)-(.*)/)
        if (choiceMatcher)
          number = choiceMatcher[1]
          question.choices[number] = question.choices[number] || {}
          question.choices[number][choiceMatcher[2]] = @value
        else
          question[idMatcher[1]] = @value
    effect = document.getElementById(@_effect)
    question['effect'] = effect.value
    return question
  # ---- event handlers ----
  onClickSaveQuestion: ->
    question = @_input2Question()
    if(question._id == '')
      wdquiz.questionClient.create(
        question
        @_genMsgHandler '保存しました。'
        @_genMsgHandler '保存に失敗しました。'
      )
    else
      wdquiz.questionClient.update(
        question._id
        question
        @_genMsgHandler '更新しました。'
        @_genMsgHandler '更新に失敗しました。'
      )
  onClickAddChoice: ->
    question = @_input2Question()
    number = (question.choices.length || 0) + 1
    question.choices.push {number: number, label:'', image:''}
    @model.set(question: question)
  onClickDeleteChoice: (event) ->
    index = $(event.target).attr('id').match(/deleteChoice(\d+)/)[1]
    question = @_input2Question()
    question.choices.splice(index, 1)
    @model.set(question: question)
  onClickCloseQuestion: ->
    wdquiz.admin.events.trigger('close:modal')
  # ---- override methods ----
  initialize: ->
    @listenTo @model, 'change', @render
  onShow: ->
    effect = document.getElementById(@_effect)
    if @model.toJSON().question.effect != undefined
      effect.value = @model.toJSON().question.effect
    else
      effect.value = '-1'
