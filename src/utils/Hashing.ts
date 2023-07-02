import * as bcrypt from 'bcrypt';

export class Hashing {
  /**
   * Generate a password hash using bcrypt.
   *
   * @param {string} password - The password to hash.
   * @return {Promise<string | null>} - The generated password hash or null if hashing fails.
   */
  static async generatePasswordHash(password: string) {
    const rounds = process.env.SALT_ROUNDS;

    if (!rounds) {
      throw new Error('Salt rounds undefine in the enviroment');
    }

    const saltRounds = Number.parseInt(rounds);
    const hash = await bcrypt.hash(password, saltRounds);

    return !hash ? null : hash;
  }

  /**
   * Check if a password matches a hash.
   *
   * @param {string} password - The password to check.
   * @param {string} hash - The hash to compare against.
   * @return {Promise<boolean>} A boolean indicating whether the password matches the hash.
   */
  static async checkPassword(password: string, hash: string) {
    const match = await bcrypt.compare(password, hash.toString());

    return match;
  }
}
