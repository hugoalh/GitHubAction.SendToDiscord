/*==================
[GitHub Action] Send To Discord
	Language:
		NodeJS/12.13.0
==================*/
const advancedDetermine = require("@hugoalh/advanced-determine"),
	githubAction = {
		core: require("@actions/core"),
		github: require("@actions/github")
	},
	jsonFlatten = require("flat").flatten,
	nodeFetch = require("node-fetch");
(async () => {
	githubAction.core.info(`Import workflow argument (stage I). ([GitHub Action] Send To Discord)`);
	let configuration = githubAction.core.getInput("configuration"),
		logMoreDetail = githubAction.core.isDebug(),
		variableSystem = {
			join: githubAction.core.getInput("variable_join"),
			prefix: githubAction.core.getInput("variable_prefix"),
			suffix: githubAction.core.getInput("variable_suffix")
		},
		webhook = {
			identificationNumber: githubAction.core.getInput("webhook_id"),
			token: githubAction.core.getInput("webhook_token")
		};
	githubAction.core.info(`Analysis workflow argument (stage I). ([GitHub Action] Send To Discord)`);
	if (advancedDetermine.isString(configuration) !== true) {
		throw new TypeError(`Argument "configuration" must be type of string (non-nullable)! ([GitHub Action] Send To Discord)`);
	};
	if (advancedDetermine.isString(variableSystem.join) !== true) {
		throw new TypeError(`Argument "variable_join" must be type of string (non-nullable)! ([GitHub Action] Send To Discord)`);
	};
	if (advancedDetermine.isString(variableSystem.prefix) !== true) {
		throw new TypeError(`Argument "variable_prefix" must be type of string (non-nullable)! ([GitHub Action] Send To Discord)`);
	};
	if (advancedDetermine.isString(variableSystem.suffix) !== true) {
		throw new TypeError(`Argument "variable_suffix" must be type of string (non-nullable)! ([GitHub Action] Send To Discord)`);
	};
	if (advancedDetermine.isString(webhook.identificationNumber) !== true) {
		throw new TypeError(`Argument "webhook_id" must be type of string (non-nullable)! ([GitHub Action] Send To Discord)`);
	};
	if (advancedDetermine.isString(webhook.token) !== true) {
		throw new TypeError(`Argument "webhook_token" must be type of string (non-nullable)! ([GitHub Action] Send To Discord)`);
	};
	let delta = {
		allowed_mentions: {
			parse: [
				"roles",
				"users",
				"everyone"
			]
		}
	};
	if (configuration.toLowerCase() === "false") {
		delta = require("./wactca.js")(logMoreDetail);
	} else if (advancedDetermine.isStringifyJSON(configuration) !== false) {
		githubAction.core.info(`Construct configuration argument (stage MCA). ([GitHub Action] Send To Discord)`);
		let data = JSON.parse(configuration);
		if (logMoreDetail === true) {
			githubAction.core.info(`Configuration Argument (Stage MCA): ${JSON.stringify(data)} ([GitHub Action] Send To Discord)`);
		};
		delta = data;
	} else if (configuration.search(/[\n\r]/gu) === -1 && configuration.search(/\.\.\//gu) === -1 && configuration.search(/\.(jsonc?)|(ya?ml)$/gu) !== -1) {
		delta = await require("./xca.js")(configuration, logMoreDetail);
	} else {
		throw new SyntaxError(`Argument "configuration"'s value is not match the require pattern! ([GitHub Action] Send To Discord)`);
	};

	// TODO
	githubAction.core.info(`Import variable list. ([GitHub Action] Send To Discord)`);
	variableSystem.list = {
		external: githubAction.core.getInput(`variable_list_external`),
		payload: githubAction.github.context.payload
	};
	githubAction.core.info(`Analysis external variable list. ([GitHub Action] Send To Discord)`);
	switch (advancedDetermine.isString(variableSystem.list.external)) {
		case false:
			throw new TypeError(`Argument "variable_list_external" must be type of object JSON! ([GitHub Action] Send To Discord)`);
		case null:
			githubAction.core.info(`External variable list is empty. ([GitHub Action] Send To Discord)`);
			variableSystem.list.external = {};
			break;
		case true:
			if (advancedDetermine.isStringifyJSON(variableSystem.list.external) === false) {
				throw new TypeError(`Argument "variable_list_external" must be type of object JSON! ([GitHub Action] Send To Discord)`);
			};
			variableSystem.list.external = JSON.parse(variableSystem.list.external);
			break;
		default:
			throw new Error();
	};
	githubAction.core.debug(`Tokenize variable list. ([GitHub Action] Send To Discord)`);
	variableSystem.list.external = jsonFlatten(
		variableSystem.list.external,
		{
			delimiter: variableSystem.join
		}
	);
	variableSystem.list.payload = jsonFlatten(
		variableSystem.list.payload,
		{
			delimiter: variableSystem.join
		}
	);
	githubAction.core.debug(`Replace variable in the data. ([GitHub Action] Send To Discord)`);
	Object.keys(variableSystem.list.payload).forEach((key) => {
		Object.keys(inputCanVariable).forEach((element) => {
			inputCanVariable[element] = inputCanVariable[element].replace(
				new RegExp(`${variableSystem.prefix}payload${variableSystem.join}${key}${variableSystem.suffix}`, "gu"),
				variableSystem.list.payload[key]
			);
		});
		inputMessageEmbedFields.forEach((field, index) => {
			inputMessageEmbedFields[index].name = inputMessageEmbedFields[index].name.replace(
				new RegExp(`${variableSystem.prefix}payload${variableSystem.join}${key}${variableSystem.suffix}`, "gu"),
				variableSystem.list.payload[key]
			);
			inputMessageEmbedFields[index].value = inputMessageEmbedFields[index].value.replace(
				new RegExp(`${variableSystem.prefix}payload${variableSystem.join}${key}${variableSystem.suffix}`, "gu"),
				variableSystem.list.payload[key]
			);
		});
	});
	Object.keys(variableSystem.list.external).forEach((key) => {
		Object.keys(inputCanVariable).forEach((element) => {
			inputCanVariable[element] = inputCanVariable[element].replace(
				new RegExp(`${variableSystem.prefix}external${variableSystem.join}${key}${variableSystem.suffix}`, "gu"),
				variableSystem.list.external[key]
			);
		});
		inputMessageEmbedFields.forEach((field, index) => {
			inputMessageEmbedFields[index].name = inputMessageEmbedFields[index].name.replace(
				new RegExp(`${variableSystem.prefix}external${variableSystem.join}${key}${variableSystem.suffix}`, "gu"),
				variableSystem.list.external[key]
			);
			inputMessageEmbedFields[index].value = inputMessageEmbedFields[index].value.replace(
				new RegExp(`${variableSystem.prefix}external${variableSystem.join}${key}${variableSystem.suffix}`, "gu"),
				variableSystem.list.external[key]
			);
		});
	});
	githubAction.core.debug(`Construct payload content. ([GitHub Action] Send To Discord)`);
	let output = {
		allowed_mentions: {
			parse: [
				"roles",
				"users",
				"everyone"
			]
		}
	};
	if (advancedDetermine.isBoolean(inputCannotVariable.messageUseTextToSpeech, { allowStringify: true }) !== true) {
		throw new TypeError(`Argument "message_usetexttospeech" must be type of boolean! ([GitHub Action] Send To Discord)`);
	};
	output.tts = (inputCannotVariable.messageUseTextToSpeech === "true");
	if (advancedDetermine.isString(inputCanVariable.webhookName) === true && inputCanVariable.webhookName.length >= 2 && inputCanVariable.webhookName.length <= 32) {
		output.username = inputCanVariable.webhookName;
	};
	if (advancedDetermine.isString(inputCanVariable.webhookAvatarUrl) === true) {
		output.avatar_url = inputCanVariable.webhookAvatarUrl;
	};
	if (advancedDetermine.isString(inputCanVariable.messageText) === true) {
		if (inputCanVariable.messageText.length > 2000) {
			inputCanVariable.messageText = `${inputCanVariable.messageText.slice(0, 1996)}...`;
		};
		output.content = inputCanVariable.messageText;
	};
	if (advancedDetermine.isString(inputCanVariable.messageEmbedAuthorName) === true ||
		advancedDetermine.isString(inputCanVariable.messageEmbedTitle) === true ||
		advancedDetermine.isString(inputCanVariable.messageEmbedDescription) === true ||
		advancedDetermine.isString(inputCanVariable.messageEmbedThumbnailUrl) === true ||
		advancedDetermine.isString(inputCanVariable.messageEmbedImageUrl) === true ||
		advancedDetermine.isString(inputCanVariable.messageEmbedVideoUrl) === true ||
		advancedDetermine.isString(inputMessageEmbedFields) === true ||
		advancedDetermine.isString(inputCanVariable.messageEmbedFooterText) === true
	) {
		output.embeds = [{}];
		if (advancedDetermine.isString(inputCannotVariable.messageEmbedColour) !== true) {
			throw new TypeError(`Argument "message_embed_colour" must be type of string (non-nullable)! ([GitHub Action] Send To Discord)`);
		};
		inputCannotVariable.messageEmbedColour = inputCannotVariable.messageEmbedColour.toUpperCase();
		let colourRGB = [];
		switch (inputCannotVariable.messageEmbedColour) {
			case "RANDOM":
				colourRGB = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
				break;
			case "DISCORDBLURPLE":
				colourRGB = [114, 137, 218];
				break;
			case "WHITE":
				colourRGB = [255, 255, 255];
				break;
			case "BLACK":
				colourRGB = [0, 0, 0];
				break;
			case "DISCORDGREYPLE":
				colourRGB = [153, 170, 181];
				break;
			case "DISCORDDARK":
				colourRGB = [44, 47, 51];
				break;
			case "DISCORDBLACK":
				colourRGB = [35, 39, 42];
				break;
			default:
				if (inputCannotVariable.messageEmbedColour.search(/^[0-9]{1,3},[0-9]{1,3},[0-9]{1,3}$/u) !== 0) {
					throw new SyntaxError(`Argument "message_embed_colour"'s value is not an expected colour scheme! Read the documentation for more information. ([GitHub Action] Send To Discord)`);
				};
				inputCannotVariable.messageEmbedColour = inputCannotVariable.messageEmbedColour.split(",");
				colourRGB = [
					Number(inputCannotVariable.messageEmbedColour[0]),
					Number(inputCannotVariable.messageEmbedColour[1]),
					Number(inputCannotVariable.messageEmbedColour[2])
				];
				colourRGB.forEach((element) => {
					if (
						advancedDetermine.isNumberPositiveInteger(element) !== true ||
						element > 255
					) {
						throw new RangeError(`Argument "message_embed_colour"'s value is not a RGB standard! Read the documentation for more information. ([GitHub Action] Send To Discord)`);
					};
				});
				break;
		};
		output.embeds[0].color = colourRGB[0] * 65536 + colourRGB[1] * 256 + colourRGB[2];
		if (advancedDetermine.isString(inputCanVariable.messageEmbedAuthorName) === true) {
			if (inputCanVariable.messageEmbedAuthorName.length > 256) {
				inputCanVariable.messageEmbedAuthorName = `${inputCanVariable.messageEmbedAuthorName.slice(0, 252)}...`;
			};
			output.embeds[0].author = {
				name: inputCanVariable.messageEmbedAuthorName
			};
			if (advancedDetermine.isString(inputCanVariable.messageEmbedAuthorAvatarUrl) === true) {
				output.embeds[0].author.icon_url = inputCanVariable.messageEmbedAuthorAvatarUrl;
			};
			if (advancedDetermine.isString(inputCanVariable.messageEmbedAuthorUrl) === true) {
				output.embeds[0].author.url = inputCanVariable.messageEmbedAuthorUrl;
			};
		};
		if (advancedDetermine.isString(inputCanVariable.messageEmbedTitle) === true) {
			if (inputCanVariable.messageEmbedTitle.length > 256) {
				inputCanVariable.messageEmbedTitle = `${inputCanVariable.messageEmbedTitle.slice(0, 252)}...`;
			};
			output.embeds[0].title = inputCanVariable.messageEmbedTitle;
			if (advancedDetermine.isString(inputCanVariable.messageEmbedTitleUrl) === true) {
				output.embeds[0].url = inputCanVariable.messageEmbedTitleUrl;
			};
		};
		if (advancedDetermine.isString(inputCanVariable.messageEmbedDescription) === true) {
			if (inputCanVariable.messageEmbedDescription.length > 2048) {
				inputCanVariable.messageEmbedDescription = `${inputCanVariable.messageEmbedDescription.slice(0, 2044)}...`;
			};
			output.embeds[0].description = inputCanVariable.messageEmbedDescription;
		};
		if (advancedDetermine.isString(inputCanVariable.messageEmbedFooterText) === true) {
			if (inputCanVariable.messageEmbedFooterText.length > 2048) {
				inputCanVariable.messageEmbedFooterText = `${inputCanVariable.messageEmbedFooterText.slice(0, 2044)}...`;
			};
			output.embeds[0].footer = {
				text: inputCanVariable.messageEmbedFooterText
			};
			if (advancedDetermine.isString(inputCanVariable.messageEmbedFooterIconUrl) === true) {
				output.embeds[0].footer.icon_url = inputCanVariable.messageEmbedFooterIconUrl;
			};
		};
		if (advancedDetermine.isString(inputCanVariable.messageEmbedImageUrl) === true) {
			output.embeds[0].image = {
				url: inputCanVariable.messageEmbedImageUrl
			};
		};
		if (advancedDetermine.isString(inputCanVariable.messageEmbedThumbnailUrl) === true) {
			output.embeds[0].thumbnail = {
				url: inputCanVariable.messageEmbedThumbnailUrl
			};
		};
		if (advancedDetermine.isString(inputCanVariable.messageEmbedVideoUrl) === true) {
			output.embeds[0].video = {
				url: inputCanVariable.messageEmbedVideoUrl
			};
		};
		inputMessageEmbedFields.forEach((field, index) => {
			if (advancedDetermine.isString(field.name) === true) {
				if (field.name.length > 256) {
					inputMessageEmbedFields[index].name = `${field.name.slice(0, 252)}...`;
				};
			} else {
				inputMessageEmbedFields[index].name = "-";
			};
			if (advancedDetermine.isString(field.value) === true) {
				if (field.value.length > 1024) {
					inputMessageEmbedFields[index].value = `${field.value.slice(0, 1020)}...`;
				};
			} else {
				inputMessageEmbedFields[index].value = "-";
			};
		});
		output.embeds[0].fields = inputMessageEmbedFields;
	};
	githubAction.core.debug(`Finalize payload content. ([GitHub Action] Send To Discord)`);
	githubAction.core.debug(`Export payload. ([GitHub Action] Send To Discord)`);
	let requestPayload = JSON.stringify(output);
	githubAction.core.debug(`Send network request to Discord. ([GitHub Action] Send To Discord)`);
	nodeFetch(
		`https://discord.com/api/webhooks/${webhook.identificationNumber}/${webhook.token}`,
		{
			body: requestPayload,
			follow: 5,
			headers: {
				"Content-Type": "application/json",
				"Content-Length": requestPayload.length,
				"User-Agent": `NodeJS/${process.version.replace(/^v/giu, "")} node-fetch/2.6.1 GitHubAction.SendToDiscord(@hugoalh)/2.1.0`
			},
			method: "POST",
			redirect: "follow"
		}
	).catch((error) => {
		throw error;
	}).then((response) => {
		if (Math.floor(Number(response.status) / 100) !== 2) {
			throw new Error(`Status Code: ${response.status} ([GitHub Action] Send To Discord)`);
		};
		githubAction.core.debug(`Status Code: ${response.status} ([GitHub Action] Send To Discord)`);
	});
})();
