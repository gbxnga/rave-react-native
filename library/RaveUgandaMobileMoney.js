import React from 'react'
import encryption from 'react-native-rave/library/encryption';
import Axios from 'axios';

export default class RaveUgandaMobileMoney {
  constructor({ publicKey, secretKey, production = false, currency = "UGX", country = "NG", txRef = "txref-" + Date.now(), network = "UGX", amount, paymenttype, orderRef = "orderref_" + Date.now(), email, firstname, lastname, is_mobile_money_ug = true, meta }) {
    var baseUrlMap = ["https://ravesandboxapi.flutterwave.com/", "https://api.ravepay.co/"]
    this.baseUrl = (production) ? baseUrlMap[1] : baseUrlMap[0];

    this.getPublicKey = function () {
      return publicKey;
    }
    this.getSecretKey = function () {
      return secretKey;
    }
    this.getCountry = function () {
      return country;
    }
    this.getCurrency = function () {
      return currency;
    }
    this.getTransactionReference = function () {
      return txRef;
    }
    this.getAmount = function () {
      return amount;
    }

    this.getPaymentType = function () {
      return paymenttype;
    }

    this.getNetwork = function () {
      return network;
    }

    this.getOrderReference = function () {
      return orderRef;
    }
    this.getEmail = function () {
      return email;
    }
    this.getFirstname = function () {
      return firstname;
    }
    this.getLastname = function () {
      return lastname;
    }
    this.getUgandaMobileMoney = function () {
      return is_mobile_money_ug;
    }
    this.getMeta = function () {
      return meta;
    }


    this.charge = function (payload) {
      //insert constant data
      payload.PBFPubKey = this.getPublicKey();
      payload.currency = this.getCurrency();
      payload.country = this.getCountry();
      payload.txRef = this.getTransactionReference();
      payload.amount = this.getAmount();
      payload.paymenttype = this.getPaymentType();
      payload.network = this.getNetwork();
      payload.orderRef = this.getOrderReference();
      payload.email = this.getEmail();
      payload.firstname = this.getFirstname();
      payload.lastname = this.getLastname();
      payload.is_mobile_money_ug = this.getUgandaMobileMoney();
      payload.meta = this.getMeta();
      

      return new Promise((resolve, reject) => {
        var client = encryption({ payload, secretkey: this.getSecretKey() });

        Axios({
          url: this.baseUrl + 'flwv3-pug/getpaidx/api/charge',
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: {
            PBFPubKey: this.getPublicKey(),
            client,
            alg: "3DES-24"
          },
        })
          .then(function (response) {
            resolve(response.data);
          })
          .catch(function (error) {
            reject(error.response.data);
          });
      })
    }
  }

  initiatecharge(payload) {
    return new Promise((resolve, reject) => {
      this.charge(payload).then((response) => {
        resolve(response);
      }).catch((e) => {
        reject(e);
      })
    })
  }

  getCardFees({ amount, currency, card6 }) {
    return new Promise((resolve, reject) => {
      Axios({
        url: this.baseUrl + 'flwv3-pug/getpaidx/api/fee',
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          PBFPubKey: this.getPublicKey(),
          amount,
          currency,
          card6
        },
      })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    })
  }

  getAccountFees({ amount, currency }) {
    return new Promise((resolve, reject) => {
      Axios({
        url: this.baseUrl + 'flwv3-pug/getpaidx/api/fee',
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          PBFPubKey: this.getPublicKey(),
          amount,
          currency,
          ptype: 2
        },
      })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    })
  }

  verifyTransaction(txref) {
    return new Promise((resolve, reject) => {
      Axios({
        url: this.baseUrl + 'flwv3-pug/getpaidx/api/v2/verify',
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: {
          txref,
          SECKEY: this.getSecretKey()
        },
      })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    })
  }


}