export function assertNotSelf(actorId: string, targetId: string, action: string) {
  if (actorId === targetId) {
    throw new Error(`You cannot change your own ${action}.`);
  }
}

export function assertNotLastAdmin(isAdmin: boolean, adminCount: number, action: string) {
  if (isAdmin && adminCount <= 1) {
    throw new Error(`The last administrator cannot be ${action}.`);
  }
}