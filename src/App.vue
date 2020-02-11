<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Sportup SmartContracts</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container class="mt-5">
        <v-card>
          <v-card-title>
            <span>
              Transfer Tokens
              <v-icon right>mdi-ethereum</v-icon>
            </span>
          </v-card-title>
          <v-card-text>
            <v-form ref="transferform" v-model="validTransfer" lazy-validation>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="transferaddress"
                    :rules="addressRules"
                    label="Reciever Address"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="amount"
                    :rules="numberRules"
                    label="Number of Tokens"
                    type="number"
                    :min="0.000000000000000001"
                    :max="1000000000"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="transfer">
                    Send
                    <v-icon right>mdi-send</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <v-row class="mt-5">
          <v-col xs="12" md="6">
            <v-card>
              <v-card-title>Data contract actions</v-card-title>
              <v-card-text>
                <v-form ref="authorizeAppform" v-model="validDataForm" lazy-validation>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="appAddress"
                        label=" Application Address"
                        :rules="addressRules"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-btn color="error" @click="auhtorizeApp">
                        Authorize
                        <v-icon right>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col xs="12" md="6">
            <v-card>
              <v-card-title>Application contract actions</v-card-title>
              <v-card-text>
                <v-form ref="authorizeOracleform" v-model="validAppForm" lazy-validation>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="oracleAddress"
                        label=" Oracle Address"
                        :rules="addressRules"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-btn color="error" @click="authorizeOracle">
                        Authorize
                        <v-icon right>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-snackbar v-model="snackbar">
          {{ message }}
          <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-container>
    </v-content>

    <v-footer color="primary" dark app>
      <v-spacer></v-spacer>
      <span class="white--text">Sportup SmartContracts &copy; {{new Date().getFullYear()}}</span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
import getWeb3 from "./util/getWeb3";
import SportupResultApp from "./util/SportupResultApp.json";
import SportupResultData from "./util/SportupResultData.json";
import SportupToken from "./util/SportupToken.json";

let web3;
export default {
  name: "App",
  data: () => ({
    message: "",
    snackbar: false,
    drawer: null,
    web3: null,
    SportupResultAppInstance: null,
    SportupResultDataInstance: null,
    SportupTokenInstance: null,
    transferaddress: "",
    appAddress: "",
    oracleAddress: "",
    amount: 1,
    validTransfer: true,
    validDataForm: true,
    validAppForm: true,
    addressRules: [
      v => !!v || "Address is required",
      v =>
        (v && web3.utils.isAddress(v.toString())) ||
        " must be Valid ethereum address"
    ],
    numberRules: [
      v => !!v || "Number of tokens is required",
      v => (v && !isNaN(v)) || "Must be invalid number",
      v => (v && v > 0) || "Must be  greater than 0"
    ],
    email: ""
  }),
  mounted() {
    // console.log("app", this.$store.getters.getWeb3);
  },
  async created() {
    let w = await getWeb3;

    web3 = w.web3;

    this.web3 = web3;
    const contract = require("truffle-contract");
    const SportupResultAppContract = contract(SportupResultApp);
    const SportupResultDataContract = contract(SportupResultData);
    const SportupTokenContract = contract(SportupToken);

    SportupResultAppContract.setProvider(web3.currentProvider);
    SportupResultDataContract.setProvider(web3.currentProvider);
    SportupTokenContract.setProvider(web3.currentProvider);

    let SportupResultAppInstance = await SportupResultAppContract.deployed();
    let SportupResultDataInstance = await SportupResultDataContract.deployed();
    let SportupTokenInstance = await SportupTokenContract.deployed();

    this.SportupResultAppInstance = SportupResultAppInstance;
    this.SportupResultDataInstance = SportupResultDataInstance;
    this.SportupTokenInstance = SportupTokenInstance;
  },
  computed: {},
  components: {},
  methods: {
    async transfer() {
      //0x59EfDFecC0D5D4B4A5DCe7a9BCab9eA3EB8Ae7b3
      if (this.$refs.transferform.validate()) {
        let acc = await this.web3.eth.getAccounts();

        let tx = await this.SportupTokenInstance.transfer(
          this.transferaddress,
          this.amount,
          { from: acc[0] }
        );

        this.message = `Transaction Hash: ${tx.tx} `;
        this.snackbar = true;
        return;
      }
    },
    async auhtorizeApp() {
      if (this.$refs.authorizeAppform.validate()) {
        let acc = await this.web3.eth.getAccounts();
        let tx = await this.SportupResultDataInstance.authorizeContract(
          this.appAddress,
          { from: acc[0] }
        );

        this.message = `Transaction Hash: ${tx.tx} `;
        this.snackbar = true;
      }
    },
    async authorizeOracle() {
      if (this.$refs.authorizeOracleform.validate()) {
        let acc = await this.web3.eth.getAccounts();
        let tx = await this.SportupResultAppInstance.authorizeOracle(
          this.oracleAddress,

          { from: acc[0] }
        );

        this.message = `Transaction Hash: ${tx.tx} `;
        this.snackbar = true;
      }
    }
  }
};
</script>
