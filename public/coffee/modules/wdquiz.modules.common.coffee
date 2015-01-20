wdquiz.module(
  'common'
  (module, app, Backbone, Marionette, $, _, base) ->
    _.extend this, {
      setCookie: (key, value, period) ->
        expire = new Date()
        expire.setTime(expire.getTime() + 1000 * 3600 * 24 * period)
        expire.toUTCString()
        cookie = key + '=' + value + ';expires=' + expire + ';';
        document.cookie = cookie
      getCookie: (key) ->
        cookies = document.cookie.split(';')
        for cookie in cookies
          if cookie.split('=')[0] == key
            return cookie.split('=')[1]
        return ''
    }
)