import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { EmailAccount } from "./types.js";

const CONFIG_DIR = path.join(os.homedir(), ".gmcli");
const ACCOUNTS_FILE = path.join(CONFIG_DIR, "accounts.json");
const CREDENTIALS_FILE = path.join(CONFIG_DIR, "credentials.json");
const DEFAULT_FILE = path.join(CONFIG_DIR, "default.json");

export class AccountStorage {
	private accounts: Map<string, EmailAccount> = new Map();

	constructor() {
		this.ensureConfigDir();
		this.fixPermissions();
		this.loadAccounts();
	}

	private ensureConfigDir(): void {
		if (!fs.existsSync(CONFIG_DIR)) {
			fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
		}
	}

	private fixPermissions(): void {
		// Fix directory permissions
		if (fs.existsSync(CONFIG_DIR)) {
			fs.chmodSync(CONFIG_DIR, 0o700);
		}
		// Fix file permissions
		for (const file of [ACCOUNTS_FILE, CREDENTIALS_FILE, DEFAULT_FILE]) {
			if (fs.existsSync(file)) {
				fs.chmodSync(file, 0o600);
			}
		}
	}

	private loadAccounts(): void {
		if (fs.existsSync(ACCOUNTS_FILE)) {
			try {
				const data = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, "utf8"));
				for (const account of data) {
					this.accounts.set(account.email, account);
				}
			} catch {
				// Ignore
			}
		}
	}

	private saveAccounts(): void {
		fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(Array.from(this.accounts.values()), null, 2), { mode: 0o600 });
	}

	addAccount(account: EmailAccount): void {
		this.accounts.set(account.email, account);
		this.saveAccounts();
	}

	getAccount(email: string): EmailAccount | undefined {
		return this.accounts.get(email);
	}

	getAllAccounts(): EmailAccount[] {
		return Array.from(this.accounts.values());
	}

	deleteAccount(email: string): boolean {
		const deleted = this.accounts.delete(email);
		if (deleted) this.saveAccounts();
		return deleted;
	}

	hasAccount(email: string): boolean {
		return this.accounts.has(email);
	}

	setCredentials(clientId: string, clientSecret: string): void {
		fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify({ clientId, clientSecret }, null, 2), { mode: 0o600 });
	}

	getCredentials(): { clientId: string; clientSecret: string } | null {
		if (!fs.existsSync(CREDENTIALS_FILE)) return null;
		try {
			return JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf8"));
		} catch {
			return null;
		}
	}

	setDefaultEmail(email: string): void {
		fs.writeFileSync(DEFAULT_FILE, JSON.stringify({ email }, null, 2), { mode: 0o600 });
	}

	getDefaultEmail(): string | null {
		if (!fs.existsSync(DEFAULT_FILE)) return null;
		try {
			const data = JSON.parse(fs.readFileSync(DEFAULT_FILE, "utf8"));
			return typeof data.email === "string" ? data.email : null;
		} catch {
			return null;
		}
	}

	clearDefaultEmail(): void {
		if (fs.existsSync(DEFAULT_FILE)) {
			fs.unlinkSync(DEFAULT_FILE);
		}
	}
}
