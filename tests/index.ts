import { createRuleTester } from "eslint-etc";
import { resolve } from "path";

import { requireVueSet } from "../src/rules/require-vue-set";

createRuleTester({
  filename: resolve("./tests/file.ts"),
})({
  types: true,
}).run("require-vue-set", requireVueSet, {
  valid: [
    // object prop
    `
    export default {
      mutations: {
        valid(state) {
          Vue.set(state.object, "prop", 123)
        }
      }
    }
    `,
    `
    export default {
      mutations: {
        valid(someOtherWord) {
          Vue.set(someOtherWord.object, "prop", 123)
        }
      }
    }
    `,
    `
    export default {
      mutations: {
        valid() {
          console.log("I'm not touching state");
        }
      }
    }
    `,
    // variable
    `
    const mutations = {
      valid(state) {
        Vue.set(state.object, "prop", 123)
      }
    }
    `,
    `
    const mutations = {
      valid(someOtherWord) {
        Vue.set(someOtherWord.object, "prop", 123)
      }
    }
    `,
    `
    const mutations = {
      valid() {
        console.log("I'm not touching state");
      }
    }
    `,
  ],

  invalid: [
    // object prop
    {
      code: `
      export default {
        mutations: {
           invalid(state) {
            state.object["prop"] = 123
          }
        }
      }
      `,
      errors: [{ messageId: "useVueSet" }],
    },
    {
      code: `
        export default {
          mutations: {
             invalid(someOtherWord) {
              someOtherWord.object["prop"] = 123
            }
          }
        }
        `,
      errors: [{ messageId: "useVueSet" }],
    },
    // variable
    {
      code: `
        const mutations = {
          invalid(state) {
            state.object["prop"] = 123
          }
        }
      `,
      errors: [{ messageId: "useVueSet" }],
    },
    {
      code: `
        const mutations = {
          invalid(someOtherWord) {
            someOtherWord.object["prop"] = 123
          }
        }
        `,
      errors: [{ messageId: "useVueSet" }],
    },
  ],
});

console.log("Tests completed successfully");
