import clientPromise from '@/lib/mongo';

export async function upsert(memberId, votes) {
    const client = await clientPromise;
    const collection = client.db('test').collection('votes');
    return await collection.updateOne({ memberId }, { $set: { votes } }, { upsert: true });
}

export async function find(memberId) {
    const client = await clientPromise;
    const collection = client.db('test').collection('votes');
    return await collection.findOne({ memberId });
}
