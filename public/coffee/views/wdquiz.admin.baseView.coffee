wdquiz.admin.baseView = {
  _genMsgHandler: (dialogMsg, consoleMsg) ->
    return () ->
      if (dialogMsg)
        window.alert dialogMsg
        console.log dialogMsg
      else if (consoleMsg)
        console.log consoleMsg
}

wdquiz.admin.LayoutView = Marionette.LayoutView.extend()
_.extend(wdquiz.admin.LayoutView.prototype, wdquiz.admin.baseView)

wdquiz.admin.ItemView = Marionette.ItemView.extend()
_.extend(wdquiz.admin.ItemView.prototype, wdquiz.admin.baseView)
