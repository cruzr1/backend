import fetch from 'node-fetch';

const [userCount, trainingsCount, reviewsCount] = process.argv.slice(2, 5);

try {
  await fetch(`http://localhost:3000/api/users/seed/${userCount}`);
  await fetch(`http://localhost:3000/api/trainings/seed/${trainingsCount}`);
  await fetch(`http://localhost:3000/api/reviews/seed/${reviewsCount}`);
} catch (err) {
  console.log(err.response.body);
}
