import client from '../discord/discord';
import { IMember } from '../interfaces/member.interface';

const guildId = process.env.GUILD_ID as string;

export async function fetchUsers() {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) return [];

    const members = await guild.members.fetch();

    const mappedMembers: IMember[] = [];
    for (const [, member] of members.entries()) {
        const url = member.user.displayAvatarURL();
        const displayName = member.displayName;
        const username = member.user.username;
        const id = member.user.id;
        if (!member.user.bot) {
            mappedMembers.push({
                url,
                username,
                displayName,
                id,
            });
        }
    }
    return mappedMembers;
}
