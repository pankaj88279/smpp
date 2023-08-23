const smpp = require('smpp');

module.exports = {
  name: "smpp_client",

  /**
   * Settings
   */
  settings: {

  },

  /**
   * Dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
  actions: {

	  /**
	   * Say a 'Hello' action.
	   *
	   * @returns
	   */
	  hello: {
		  rest: {
			  method: "GET",
			  path: "/hello"
		  },
		  async handler() {
			  return "Hello Moleculer";
		  }
	  },  
	 
  },
  async started() {
    try {
      const clientSession = await this.createClientSession();

      clientSession.on('submit_sm_resp', (pdu) => {
        if (pdu.command_status === 0) {
          console.log('Message submission response received. Message ID:', pdu.message_id);
        } else {
          console.error('Message submission failed. Error code:', pdu.command_status);
        }
        clientSession.close();
      });

      clientSession.on('close', () => {
        console.log('Session closed');
      });

      clientSession.on('error', (error) => {
        console.error('Session error:', error);
      });
    } catch (error) {
      console.error('Error while initializing SMPP client:', error);
    }
  },

  methods: {
    async createClientSession() {
      return new Promise((resolve, reject) => {
        const clientSession = smpp.connect({
          url: 'smpp://localhost:2775',
          auto_enquire_link_period: 10000,
          debug: true
        }, () => {
          clientSession.bind_transceiver({
            system_id: 'admin',
            password: 'admin@123'
          }, (pdu) => {
            if (pdu.command_status === 0) {
              console.log('Successfully bound');
              resolve(clientSession);
            } else {
              console.error('Binding failed. Error code:', pdu.command_status);
              clientSession.close();
              reject(new Error('Binding failed'));
            }
          });
        });
      });
    },

    async sendSMS() {
      try {
        const clientSession = await this.createClientSession();
        clientSession.submit_sm({
          source_addr: 'sender',
          destination_addr: 'receiver',
          short_message: 'Hello, this is an SMS!'
        });
      } catch (error) {
        console.error('Error while sending SMS:', error);
      }
    }
  }
};