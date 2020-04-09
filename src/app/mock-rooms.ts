import { Room } from './room'

export const ROOMS: Room[] = [
	{
		id: 1,
		name: 'Test Room 1',
		creator_id: 4,
		created_at: new Date(Date.parse('01 Apr 2020 02:28:21 UTC +00:00')),
		updated_at: new Date(),
		closed_at: null
	},
	{
		id: 2,
		name: 'Test Room 2',
		creator_id: 2,
		created_at: new Date(Date.parse('03 Apr 2020 02:28:21 UTC +00:00')),
		updated_at: new Date(),
		closed_at: null
	},
	{
		id: 3,
		name: 'Test Room 3',
		creator_id: 6,
		created_at: new Date(Date.parse('04 Apr 2020 02:28:21 UTC +00:00')),
		updated_at: new Date(),
		closed_at: null
	},
	{
		id: 4,
		name: 'Test Room 4',
		creator_id: 5,
		created_at: new Date(Date.parse('08 Apr 2020 02:28:21 UTC +00:00')),
		updated_at: new Date(),
		closed_at: null
	}
];