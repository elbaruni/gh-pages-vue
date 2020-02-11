import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader

import colors from "vuetify/lib/util/colors";
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi" // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        primary: "#34b4e3", //colors.lightBlue.accent1,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        info: colors.orange.darken1,
        success: colors.shades.black,
        warning: colors.grey.darken1,
        error: colors.red.darken1
      },
      dark: {
        primary: "#34b4e3", //colors.lightGreen,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3
      }
    }
  }
});
