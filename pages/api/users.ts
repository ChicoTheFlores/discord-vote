import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchUsers } from 'lib/api/discord';
import { find } from 'lib/api/votes';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const session = await getSession({ req });

        if (!session || !session.user?.name) {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }
        try {
            const members = await fetchUsers();
            const me = members.find(m => m.username === session.user?.name);
            if (!me) {
                return res.status(401).json({
                    error: 'Unauthorized',
                });
            }
            const votes = await find(me.id);
            const sorted = votes?.votes?.length
                ? votes?.votes.map(v => members.find(m => m.id === v))
                : members;
            return res.status(200).json({ members: sorted, me });
        } catch (e: any) {
            console.log(e);
            return res.status(500).json({
                error: e.toString(),
            });
        }
    } else {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
