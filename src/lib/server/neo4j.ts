import neo4j, { Integer, Node } from 'neo4j-driver';
import { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } from '$env/static/private';

export const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

export interface UserProperties {
	email: string;
	token: string;
	lastVote?: string;
}

export type User = Node<Integer, UserProperties>;

export interface EntryProperties extends Record<string, unknown> {
	entry: 'video' | 'non-video';
	title: string;
	description: string;
	link: string;
	flagged?: boolean;
	flaggedBy?: string;
	flagReason?: string;
	number: number;
	points: number;
}

export type Entry = Node<Integer, EntryProperties>;
