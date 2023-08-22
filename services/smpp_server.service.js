"use strict";
const { Service } = require("moleculer");
const smpp = require("smpp");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    name: "smpp_server",
    settings: {
        server:null,
        clientList:[]
    },

    dependencies: [],

    actions: {
        hello: {
            rest: {
                method: "GET",
                path: "/hello",
            },
            async handler() {
                return "Hello Moleculer";
            },
        },
    },

    methods: {
        async handleSession(session) {
            session.on("error", (err) => {
                this.logger.error("Session error:", err);
            });

            session.on("bind_transceiver", (pdu) => {
                session.pause();
                this.checkAsyncUserPass(
                    session,
                    pdu.system_id,
                    pdu.password,
                    (err) => {
                        if (err) {
                            // Handle authentication failure
                            session.send(
                                pdu.response({
                                    command_status: smpp.ESME_RBINDFAIL,
                                })
                            );
                            this.logger.info("SMS Client Disconnected ",session );
                            session.close();
                        } else {
                            
                            session.send(
                                pdu.response({
                                    system_id: pdu.system_id,
                                })
                            );
                            this.logger.info("SMS Client Connected ",session );
                            session.resume();
                        }
                    }
                );
            });

            session.on("submit_sm", (pdu) => {

                // Handle submit_sm logic
                // ... Rest of your submit_sm logic ...
            });

            // ... More event handlers ...
        },

        async getAllUsers() {
            const user = await prisma.user.findMany();({
        
            });
            return user;
        },
        async checkAsyncUserPass(systemId, password, callback) {
            
            const users  = await this.getAllUsers();
            
            this.settings.clientList = users.map(row => ({
                id: row.id,
                username: row.username,
                password: row.password,
                clientName: row.clientName,
                active: row.active
            }));

            console.log(this.settings.clientList);
            var found = false;
            for (const userObj of this.settings.clientList) {
                if (userObj.username === systemId && userObj.password === password && userObj.active == 1) {
                    found = true;
                    console.log('Username and password matched for user:', userObj.username);
                    break;
                }
            } 
            if (found) {
                return false; // Validation successful
            } else {
                new Error('Invalid credentials'); // Validation failed
            }   
        },

    },

    created() {
        this.settings.server = smpp.createServer(
            {
                debug: true,
            },
            this.handleSession.bind(this.settings.server)
        );
    },

    async started() {
        this.settings.server.listen(2775, () => {
            this.logger.info("SMPP server started and listening on port 2775");
        });
    },

    async stopped() {
        this.logger.info("SMPP service stopped");
    },
};
