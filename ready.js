const { Events } = require('discord.js');
const { license, port, id, secret, domain, redirectUri, ownerIDs } = require('../config.json');
let DBD = require('discord-dashboard');
const SoftUI = require("dbd-soft-ui");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        client.user.setPresence({ activities: [{ name: 'Roleplay' }], status: 'idle' });
		console.log(`Ready! Logged in as ${client.user.tag}`);


		//
		// DASHBOARD
		//

		const Handler = new DBD.Handler(
			/*
					Keyv storage instance
					Example: { store: new KeyvMongo('mongodb://user:pass@localhost:27017/dbname') }
		
					Can be left empty to use the default storage (Keyv with SQLite)
				*/
		);
		
		(async ()=>{
			await DBD.useLicense(license);
			DBD.Dashboard = DBD.UpdatedClass();
		
			const Dashboard = new DBD.Dashboard({
				port: port,
				client: { id, secret },
				redirectUri: `${domain}${redirectUri}`,
				domain: domain,
				ownerIDs: ownerIDs,
				useThemeMaintenance: true,
				useTheme404: true,
				bot: client,
				theme: SoftUI({
					storage: Handler,
					customThemeOptions: {
						index: async ({ req, res, config }) => {
							return {
								values: [],
								graph: {}, // More info at https://dbd-docs.assistantscenter.com/soft-ui/docs/customThemeOptions/
								cards: [],
							}
						},
					},
					websiteName: "RoleplayManager",
					colorScheme: "pink",
					supporteMail: "support@support.com",
					icons: {
						favicon: "https://cdn.discordapp.com/attachments/1035476452277243915/1170084000338022430/RoleplayManager_Icon.png",
						noGuildIcon: "https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/discord-512.png",
						sidebar: {
							darkUrl: "https://assistantscenter.com/api/user/avatar/63ad65e2d3f1b1b3acdff794",
							lightUrl: "https://assistantscenter.com/api/user/avatar/63ad65e2d3f1b1b3acdff794",
							hideName: true,
							borderRadius: false,
							alignCenter: true,
						},
					},
					index: {
						graph: {
							enabled: true,
							lineGraph: false,
							tag: 'Memory (MB)',
							max: 100
						},
					},
					sweetalert: {
						errors: {},
						success: {
							login: "Successfully logged in.",
						}
					},
					preloader: {
						image: "/img/soft-ui.webp",
						spinner: false,
						text: "Page is loading",
					},
					admin: {
						pterodactyl: {
							enabled: false,
							apiKey: "apiKey",
							panelLink: "https://panel.website.com",
							serverUUIDs: []
						}
					},
					commands: [],
				}),		
				settings: []
			});
			Dashboard.init();
		})();
	},
};