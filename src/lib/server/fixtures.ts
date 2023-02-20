export function makeCreators(n: number) {
	const creators = [];

	for (let i = 0; i < n; i++) {
		creators.push({
			email: `email${i}@gmail.com`,
			title: `title${i}`,
			description:
				'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem sequi ipsum ex dolores, placeat dolor blanditiis est voluptatibus similique ad nobis ab fugit explicabo tempore asperiores aliquid id itaque neque.',
			link: `http://link${i}.com`,
			number: i
		});
	}

	return creators;
}
