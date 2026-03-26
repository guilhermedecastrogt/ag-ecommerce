import { Argon2PasswordHasher } from './argon2-password-hasher';

describe('Argon2PasswordHasher', () => {
  let hasher: Argon2PasswordHasher;

  beforeEach(() => {
    hasher = new Argon2PasswordHasher();
  });

  it('hash returns a non-empty string different from the original password', async () => {
    const password = 'MySecret123!';
    const hashed = await hasher.hash(password);
    expect(hashed).toBeTruthy();
    expect(hashed).not.toBe(password);
  });

  it('verify returns true for the correct password', async () => {
    const password = 'CorrectPassword!';
    const hashed = await hasher.hash(password);
    await expect(hasher.verify(password, hashed)).resolves.toBe(true);
  });

  it('verify returns false for the wrong password', async () => {
    const password = 'CorrectPassword!';
    const hashed = await hasher.hash(password);
    await expect(hasher.verify('WrongPassword!', hashed)).resolves.toBe(false);
  });

  it('verify returns false for an invalid hash without throwing', async () => {
    await expect(
      hasher.verify('anyPassword', 'not-a-valid-hash'),
    ).resolves.toBe(false);
  });
});
