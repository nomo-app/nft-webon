export function prettyLogData(text: string, data: unknown) {
	console.log(`\n%c--------------- ${text} ---------------\n`, 'color:darkturquoise');
	console.log(data);
	console.log(`\n%c--------------- DATA END ---------------\n`, 'color:darkturquoise');
}

export function prettyLogText(text: string) {
	console.log(`\n%c--------------- ${text} ---------------\n`, 'color:yellow');
}

export function prettyLogError(text: unknown) {
	console.log(`\n%c--------------- ERROR ---------------\n`, 'color:red');
	console.error(text);
	console.log(`\n%c--------------- ERROR END ---------------\n`, 'color:red');
}

export function throwError(text: string) {
	prettyLogError(text);
	throw new Error(text);
}
