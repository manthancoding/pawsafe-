const { db } = require('./config/firebaseAdmin');

const animals = [
    {
        name: 'Buddy',
        species: 'dog',
        emoji: '🐕',
        status: 'stable',
        rescuedBy: 'Anshu',
        rescueDate: '2026-03-10',
        vet: 'Dr. Sharma',
        location: 'Dadar, Mumbai',
        photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
        description: 'Friendly golden retriever rescued from the streets. Very healthy and playful.',
        milestones: [
            { date: '2026-03-10', label: 'Rescued', completed: true },
            { date: '2026-03-12', label: 'Vaccinated', completed: true },
            { date: '2026-04-01', label: 'Ready for Adoption', completed: false }
        ]
    },
    {
        name: 'Luna',
        species: 'cat',
        emoji: '🐈',
        status: 'recovering',
        rescuedBy: 'Meera',
        rescueDate: '2026-03-12',
        vet: 'Dr. Patil',
        location: 'Andheri, Mumbai',
        photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
        description: 'Sweet calico cat recovering from a minor leg injury. Very affectionate.',
        milestones: [
            { date: '2026-03-12', label: 'Rescued', completed: true },
            { date: '2026-03-15', label: 'Surgery', completed: true },
            { date: '2026-03-25', label: 'Stitch Removal', completed: false }
        ]
    },
    {
        name: 'Max',
        species: 'dog',
        emoji: '🐶',
        status: 'critical',
        rescuedBy: 'Rahul',
        rescueDate: '2026-03-17',
        vet: 'City Vet Hospital',
        location: 'Bandra, Mumbai',
        photoUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400',
        description: 'Indie dog found with severe dehydration and multiple wounds. Currently under intensive care.',
        milestones: [
            { date: '2026-03-17', label: 'Rescued', completed: true },
            { date: '2026-03-17', label: 'IV Fluids Started', completed: true }
        ]
    },
    {
        name: 'Coco',
        species: 'rabbit',
        emoji: '🐰',
        status: 'stable',
        rescuedBy: 'Saniya',
        rescueDate: '2026-03-05',
        vet: 'Dr. Dave',
        location: 'Colaba, Mumbai',
        photoUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=400',
        description: 'Rescued from an abandoned park. Very calm and loves carrots.',
        milestones: [
            { date: '2026-03-05', label: 'Rescued', completed: true },
            { date: '2026-03-20', label: 'Health Checkup', completed: false }
        ]
    },
    {
        name: 'Oliver',
        species: 'cat',
        emoji: '🐱',
        status: 'adopted',
        rescuedBy: 'System',
        rescueDate: '2026-02-15',
        vet: 'Dr. Patil',
        location: 'Juhu, Mumbai',
        photoUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400',
        description: 'A ginger cat who found his forever home last month!',
        milestones: [
            { date: '2026-02-15', label: 'Rescued', completed: true },
            { date: '2026-03-10', label: 'Adopted', completed: true }
        ]
    },
    {
        name: 'Simba',
        species: 'lion',
        emoji: '🦁',
        status: 'released',
        rescuedBy: 'Wildlife Rescue',
        rescueDate: '2026-01-20',
        vet: 'Nat Geo Vets',
        location: 'Sanjay Gandhi National Park',
        photoUrl: 'https://images.unsplash.com/photo-1614027126733-7718e2652b12?q=80&w=600&auto=format&fit=crop',
        description: 'Cub rescued from a trap and successfully rehabilitated.',
        milestones: [
            { date: '2026-01-20', label: 'Rescued', completed: true },
            { date: '2026-03-01', label: 'Released into Wild', completed: true }
        ]
    },
    {
        name: 'Bella',
        species: 'dog',
        emoji: '🐕‍🦺',
        status: 'stable',
        rescuedBy: 'Anita',
        rescueDate: '2026-03-14',
        vet: 'Paws & Claws Clinic',
        location: 'Powai, Mumbai',
        photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
        description: 'Sweet senior dog looking for a quiet home.',
        milestones: [
            { date: '2026-03-14', label: 'Rescued', completed: true },
            { date: '2026-03-25', label: 'Dental Cleaning', completed: false }
        ]
    },
    {
        name: 'Sky',
        species: 'bird',
        emoji: '🦅',
        status: 'recovering',
        rescuedBy: 'Bird Watchers',
        rescueDate: '2026-03-16',
        vet: 'Avian Specialist',
        location: 'Thane, Mumbai',
        photoUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30fc97?q=80&w=600&auto=format&fit=crop',
        description: 'Rescued eagle with a wing injury. Showing great progress.',
        milestones: [
            { date: '2026-03-16', label: 'Rescued', completed: true },
            { date: '2026-03-20', label: 'First Flight Post-Surgery', completed: false }
        ]
    }
];

async function seed() {
    console.log('🌱 Seeding animals...');
    try {
        for (const animal of animals) {
            await db.collection('animals').add({
                ...animal,
                createdAt: new Date()
            });
            console.log(`✅ Added ${animal.name}`);
        }
        console.log('✨ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
