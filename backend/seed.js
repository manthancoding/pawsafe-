require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Emergency = require('./models/Emergency');
const Volunteer = require('./models/Volunteer');
const NGO = require('./models/NGO');
const Animal = require('./models/Animal');

// ── Seed Data ──────────────────────────────────────────────

const volunteers = [
    { name: 'Arjun Mehta', city: 'Mumbai', phone: '9876543210', avatar: '🧑‍🚒', rating: 4.8, totalRescues: 47, badge: 'Gold Rescuer', isActive: true },
    { name: 'Priya Sharma', city: 'Mumbai', phone: '9876543211', avatar: '👩‍🔬', rating: 4.9, totalRescues: 62, badge: 'Gold Rescuer', isActive: true },
    { name: 'Rahul Nair', city: 'Bangalore', phone: '9876543212', avatar: '🧑‍⚕️', rating: 4.7, totalRescues: 33, badge: 'Silver Rescuer', isActive: true },
    { name: 'Sonia Kapoor', city: 'Delhi', phone: '9876543213', avatar: '👩‍🚒', rating: 4.6, totalRescues: 21, badge: 'Silver Rescuer', isActive: true },
    { name: 'Vikram Joshi', city: 'Jamshedpur', phone: '9040959368', avatar: '🧑‍🦱', rating: 5.0, totalRescues: 5, badge: 'Bronze Rescuer', isActive: true },
];

const ngos = [
    { name: 'Paws & Claws Mumbai', city: 'Mumbai', state: 'Maharashtra', phone: '022-12345678', email: 'info@pawsclaws.in', type: 'Animal Rescue', animals: ['Dog', 'Cat'], verified: true, latitude: 19.076, longitude: 72.877 },
    { name: 'Bangalore Animal Care', city: 'Bangalore', state: 'Karnataka', phone: '080-87654321', email: 'help@bac.org', type: 'Animal Shelter', animals: ['Dog', 'Cat', 'Bird'], verified: true, latitude: 12.971, longitude: 77.594 },
    { name: 'Delhi Street Animal Rescue', city: 'Delhi', state: 'Delhi', phone: '011-11111111', email: 'rescue@dsar.in', type: 'Animal Rescue', animals: ['Dog', 'Cow'], verified: true, latitude: 28.704, longitude: 77.102 },
    { name: 'Hyderabad Wildlife Aid', city: 'Hyderabad', state: 'Telangana', phone: '040-22222222', email: 'aid@hwl.org', type: 'Wildlife', animals: ['Bird', 'Reptile'], verified: true, latitude: 17.385, longitude: 78.486 },
    { name: 'Chennai Animal Foundation', city: 'Chennai', state: 'Tamil Nadu', phone: '044-33333333', email: 'contact@caf.in', type: 'Animal Shelter', animals: ['Dog', 'Cat'], verified: true, latitude: 13.082, longitude: 80.270 },
    { name: 'Jamshedpur Pet Care', city: 'Jamshedpur', state: 'Jharkhand', phone: '0657-4444444', email: 'care@jpc.in', type: 'Animal Rescue', animals: ['Dog', 'Cat', 'Cow'], verified: true, latitude: 22.804, longitude: 86.185 },
    { name: 'Kolkata Animal Welfare', city: 'Kolkata', state: 'West Bengal', phone: '033-55555555', email: 'welfare@kaw.org', type: 'Animal Welfare', animals: ['Dog', 'Cat'], verified: true, latitude: 22.572, longitude: 88.363 },
    { name: 'Pune Wildlife Society', city: 'Pune', state: 'Maharashtra', phone: '020-66666666', email: 'info@pws.in', type: 'Wildlife', animals: ['Bird', 'Reptile', 'Mammal'], verified: true, latitude: 18.519, longitude: 73.855 },
    { name: 'Ahmedabad Stray Help', city: 'Ahmedabad', state: 'Gujarat', phone: '079-77777777', email: 'help@ash.in', type: 'Animal Rescue', animals: ['Dog', 'Cat'], verified: true, latitude: 23.022, longitude: 72.571 },
    { name: 'Lucknow Animal Aid', city: 'Lucknow', state: 'Uttar Pradesh', phone: '0522-8888888', email: 'info@laa.org', type: 'Animal Shelter', animals: ['Dog', 'Cow', 'Goat'], verified: true, latitude: 26.846, longitude: 80.946 },
];

const emergencies = [
    {
        animalType: 'dog', issueType: 'injured',
        location: 'NH48 near Andheri Flyover, Mumbai',
        latitude: 19.119, longitude: 72.847,
        details: 'Large dog hit by vehicle. Bleeding from hind leg. Conscious but unable to move.',
        name: 'Priya Sharma', phone: '9876543211',
        status: 'active', urgency: 'critical',
    },
    {
        animalType: 'cat', issueType: 'trapped',
        location: 'Borivali East drain, Mumbai',
        latitude: 19.233, longitude: 72.856,
        details: 'Small kitten stuck in open drain. Meowing loudly. Needs immediate retrieval.',
        name: 'Rahul Nair', phone: '9876543212',
        status: 'active', urgency: 'urgent',
    },
    {
        animalType: 'bird', issueType: 'injured',
        location: 'Powai Lake area, Mumbai',
        latitude: 19.118, longitude: 72.906,
        details: 'Large bird on ground, cannot fly. Wing appears fractured. Safe area.',
        name: 'Sonia Kapoor', phone: '9876543213',
        status: 'pending', urgency: 'moderate',
    },
];

const animals = [
    {
        name: 'Bruno',
        species: 'dog', emoji: '🐶',
        status: 'recovering',
        rescuedBy: 'Arjun Mehta',
        rescueDate: '01 Mar 2026',
        vet: 'Dr. Sunita Rao',
        location: 'Andheri West, Mumbai',
        description: 'Street dog rescued after being hit by a car. Hind leg fracture treated.',
        notes: [
            { date: '01 Mar 2026', author: 'Dr. Sunita Rao', content: 'X-ray shows clean fracture on right hind leg. Cast applied. Antibiotics started.' },
            { date: '04 Mar 2026', author: 'Dr. Sunita Rao', content: 'Eating well. No infection signs. Cast holding. Mild improvement in mobility.' },
        ],
        milestones: [
            { date: '01 Mar', label: 'Rescued & Admitted', completed: true },
            { date: '02 Mar', label: 'Surgery / Treatment', completed: true },
            { date: '05 Mar', label: 'Stable Condition', completed: true },
            { date: '15 Mar', label: 'Cast Removal', completed: false },
            { date: '22 Mar', label: 'Ready for Adoption', completed: false },
        ],
    },
    {
        name: 'Luna',
        species: 'cat', emoji: '🐱',
        status: 'stable',
        rescuedBy: 'Priya Sharma',
        rescueDate: '28 Feb 2026',
        vet: 'Dr. Anil Kumar',
        location: 'Borivali, Mumbai',
        description: 'Kitten rescued from a drain. Malnourished and dehydrated on arrival.',
        notes: [
            { date: '28 Feb 2026', author: 'Dr. Anil Kumar', content: 'Severely dehydrated. IV fluids started. Weight: 800g (underweight).' },
            { date: '03 Mar 2026', author: 'Dr. Anil Kumar', content: 'Responding well to fluids. Now eating soft food. Weight up to 950g.' },
        ],
        milestones: [
            { date: '28 Feb', label: 'Rescued & Admitted', completed: true },
            { date: '01 Mar', label: 'IV Fluids & Nutrition', completed: true },
            { date: '05 Mar', label: 'Eating Independently', completed: true },
            { date: '12 Mar', label: 'Weight Target (1.2kg)', completed: false },
            { date: '20 Mar', label: 'Ready for Adoption', completed: false },
        ],
    },
    {
        name: 'Sky',
        species: 'bird', emoji: '🦅',
        status: 'critical',
        rescuedBy: 'Rahul Nair',
        rescueDate: '05 Mar 2026',
        vet: 'Dr. Meera Pillai',
        location: 'Powai, Mumbai',
        description: 'Eagle with fractured wing found on ground near Powai Lake.',
        notes: [
            { date: '05 Mar 2026', author: 'Dr. Meera Pillai', content: 'Fractured right wing. Splint applied. Bird is alert but in pain. Pain medication given.' },
        ],
        milestones: [
            { date: '05 Mar', label: 'Rescued & Admitted', completed: true },
            { date: '06 Mar', label: 'Wing Splint Applied', completed: true },
            { date: '12 Mar', label: 'Stable Condition', completed: false },
            { date: '25 Mar', label: 'Flight Test', completed: false },
            { date: '30 Mar', label: 'Released to Wild', completed: false },
        ],
    },
    {
        name: 'Moti',
        species: 'dog', emoji: '🐶',
        status: 'released',
        rescuedBy: 'Arjun Mehta',
        rescueDate: '25 Feb 2026',
        vet: 'Dr. Sunita Rao',
        location: 'Dadar, Mumbai',
        description: 'Street dog with infected wound on leg. Treated and released.',
        notes: [
            { date: '25 Feb 2026', author: 'Dr. Sunita Rao', content: 'Deep wound cleaned and sutured. Antibiotics for 10 days.' },
            { date: '07 Mar 2026', author: 'Dr. Sunita Rao', content: 'Wound healed cleanly. Dog healthy and active. Released to original area.' },
        ],
        milestones: [
            { date: '25 Feb', label: 'Rescued & Admitted', completed: true },
            { date: '25 Feb', label: 'Wound Treatment', completed: true },
            { date: '01 Mar', label: 'Stable Condition', completed: true },
            { date: '07 Mar', label: 'Full Recovery', completed: true },
            { date: '07 Mar', label: 'Released / Adopted', completed: true },
        ],
    },
];

// ── Run Seed ───────────────────────────────────────────────
async function seed() {
    await connectDB();

    console.log('🌱 Clearing existing data...');
    await Promise.all([
        Emergency.deleteMany({}),
        Volunteer.deleteMany({}),
        NGO.deleteMany({}),
        Animal.deleteMany({}),
    ]);

    console.log('🌱 Inserting volunteers...');
    await Volunteer.insertMany(volunteers);

    console.log('🌱 Inserting NGOs...');
    await NGO.insertMany(ngos);

    console.log('🌱 Inserting emergencies...');
    await Emergency.insertMany(emergencies);

    console.log('🌱 Inserting animals...');
    await Animal.insertMany(animals);

    console.log('\n✅ Database seeded successfully!');
    console.log(`   👥 ${volunteers.length} volunteers`);
    console.log(`   🏥 ${ngos.length} NGOs`);
    console.log(`   🚨 ${emergencies.length} emergencies`);
    console.log(`   🐾 ${animals.length} animals\n`);

    mongoose.connection.close();
}

seed().catch((err) => {
    console.error('❌ Seed error:', err);
    process.exit(1);
});
