import type { PageServerLoad } from './$types';
import { driver } from '$lib/server/noe4j';

export const load: PageServerLoad = async () => {
	const session = driver.session();
	try {
		await session.executeWrite((tx) => {
			return tx.run(`
      CREATE CONSTRAINT UserEmailUnique
      IF NOT EXISTS
      FOR (user:User)
      REQUIRE user.email IS UNIQUE;
      `);
		});

		await session.executeWrite((tx) => {
			return tx.run(`
      CREATE CONSTRAINT EntryLinkUnique
      IF NOT EXISTS
      FOR (entry:Entry)
      REQUIRE entry.link IS UNIQUE;
      `);
		});

		// Sequence for entries
		await session.executeWrite((tx) => {
			return tx.run(`
      MERGE (s:Seq)
      ON CREATE
        SET s.value = 0
      `);
		});

		return { success: true };
	} catch (error) {
		console.log(error);
		return { success: false };
	} finally {
		session.close();
	}
};
