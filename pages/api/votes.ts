import type { NextApiRequest, NextApiResponse } from 'next';
import { upsert } from 'lib/api/votes';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // const session = await getSession({ req });

        // if (!session || !session.user?.name) {
        //     return res.status(401).json({
        //         error: 'Unauthorized',
        //     });
        // }
        try {
            const { memberId, votes } = JSON.parse(req.body);
            
            const result = await upsert(memberId, votes);

            return res.status(200).json(result);
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
