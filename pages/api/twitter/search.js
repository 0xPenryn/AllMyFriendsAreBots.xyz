import { getSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt';


export default async (req, res) => {
    const session = await getSession({ req });
    const token = await getToken({ req });

    console.log('session', session ?? 'No session');
    console.log('token', token ?? 'No token');

    try {
      return res.status(200).json({
        status: (session, 'Ok'),
        data: []
      });
    } catch(e) {
      return res.status(400).json({
        status: e.message
      });
    }
  }