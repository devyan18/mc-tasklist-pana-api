import { connect } from 'mongoose';

export const startConnection = async (URI: string) => {
  try {
    const conn = await connect(URI);
    console.log(`Database connected to ${conn.connection.name}`);
  } catch (error) {
    console.error(error);
  }
};
