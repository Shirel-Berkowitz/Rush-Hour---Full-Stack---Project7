import { python } from "pythonia";
const rand = await python("./random_choices.py");
console.log(await rand.get_random_word());
python.exit();