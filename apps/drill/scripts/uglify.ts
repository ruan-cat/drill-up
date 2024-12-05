import path, { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";

import * as UglifyJS from "uglify-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryPath = path.join(process.cwd(), "dist");

function compressJSFiles(dir: string) {
	fs.readdir(dir, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			process.exit(1);
		}

		files.forEach((file) => {
			const filePath = path.join(dir, file);

			fs.stat(filePath, (error, stat) => {
				if (error) {
					console.error("Error stating file.", error);
					return;
				}

				if (stat.isFile() && path.extname(file) === ".js") {
					const result = UglifyJS.minify(fs.readFileSync(filePath, "utf8"), {
						output: {
							comments: false,
							beautify: false,
							indent_level: 0,
						},
					});

					if (result.error) {
						console.error("Error minifying file.", result.error);
						return;
					}

					fs.writeFileSync(filePath, result.code, "utf8");
					console.log(`Successfully compressed: ${filePath}`);
				} else if (stat.isDirectory()) {
					compressJSFiles(filePath);
				}
			});
		});
	});
}

compressJSFiles(directoryPath);
