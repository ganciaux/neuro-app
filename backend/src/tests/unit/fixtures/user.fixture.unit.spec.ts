import { Role } from '@prisma/client';
import { userFixture } from '../../fixtures/users';

describe('User Fixtures', () => {
  it('should generate valid user data', () => {
    const user = userFixture.build();
    expect(user.email).toMatch(/@.+\..+/);
    expect(user.password).toMatch(/[A-Z]/);
    expect(user.password).toMatch(/[0-9]/);
    expect(user.password).toMatch(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/);
  });

  it('should apply overrides correctly', () => {
    const admin = userFixture.build({ role: Role.ADMIN, email: 'admin@example.com', name: 'Admin User', password: 'AdminPass123!', isActive: true });
    expect(admin.role).toBe(Role.ADMIN);
    expect(admin.email).toBe('admin@example.com');
    expect(admin.name).toBe('Admin User');
    expect(admin.password).toBe('AdminPass123!');
    expect(admin.isActive).toBe(true);
  });

  it('should generate unique emails', () => {
    const user1 = userFixture.build();
    const user2 = userFixture.build();
    expect(user1.email).not.toBe(user2.email);
  });

});