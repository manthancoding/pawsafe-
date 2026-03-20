// translations.js — All supported languages for PawSafe

const translations = {
    en: {
        // Header
        nav: {
            home: 'Home',
            about: 'About',
            contact: 'Contact',
        },
        header: {
            login: '🔑 Login',
            volunteer: '🤝 Volunteer',
            emergency: '🚨 Emergency',
            groups: {
                rescue: '🐾 Rescue',
                community: '🤝 Community',
                info: 'ℹ️ Info',
            }
        },

        // Hero
        hero: {
            title: 'Emergency Animal Rescue',
            subtitle: 'Report animal emergencies instantly. Connect with rescuers in your area. Save lives together.',
            brandLine: 'with',
            report: '🚨 Report an Emergency',
            learnMore: 'Learn More',
            trustedBy: 'Trusted by 10,000+ Pet Owners',
        },

        // Features
        features: {
            heading: 'Why Choose PawSafe',
            subtitle: 'Powerful features designed to save animal lives',
            items: [
                { icon: '📍', title: 'Real-Time Location', description: 'Share exact GPS coordinates for rapid rescue response' },
                { icon: '📸', title: 'Photo Evidence', description: 'Capture images to help rescuers identify the animal' },
                { icon: '👥', title: 'Community Network', description: 'Connect with professional rescuers and volunteers' },
                { icon: '⏱️', title: 'Fast Response', description: '24/7 emergency alert system for immediate action' },
                { icon: '📱', title: 'Mobile First', description: 'Easy-to-use app designed for quick reporting' },
                { icon: '📊', title: 'Case Tracking', description: 'Follow up on rescues and track animal recovery' },
            ],
        },

        // How It Works
        howItWorks: {
            heading: 'How It Works',
            subtitle: 'Simple steps to save a life',
            steps: [
                { number: '1', title: 'Report', description: 'Tap the emergency button and share details about the animal in distress' },
                { number: '2', title: 'Share Location', description: 'Provide exact GPS coordinates and photos to help rescuers locate the animal' },
                { number: '3', title: 'Alert Network', description: 'Your report is instantly sent to nearby rescue professionals and volunteers' },
                { number: '4', title: 'Rescue', description: 'Trained rescuers respond quickly to save the animal and provide care' },
            ],
            cta: {
                title: 'Ready to Help?',
                subtitle: 'Join thousands of animal lovers making a difference every day',
                button: 'Get Started Now',
            },
        },

        // About Page
        about: {
            heading: 'About PawSafe',
            p1: 'PawSafe is a community-driven emergency response platform dedicated to rescuing animals in distress. Our mission is to connect concerned citizens with local rescue organizations to save lives.',
            mission: 'Our Mission',
            p2: 'Every animal deserves safety and care. When an animal is in danger, time is critical. PawSafe bridges the gap between those who witness animal emergencies and rescue professionals who can help.',
            difference: 'How We Make a Difference',
            list: [
                '📍 Real-time location sharing for rapid response',
                '👥 Community network of animal lovers and professionals',
                '📱 Easy-to-use mobile-first platform',
                '🚨 Emergency alert system for immediate action',
                '📊 Tracking and follow-up care coordination',
            ],
        },

        // Contact Page
        contact: {
            heading: 'Get In Touch',
            form: {
                title: 'Send us a Message',
                name: 'Your Name',
                email: 'Your Email',
                message: 'Your Message',
                send: 'Send Message',
                success: 'Thank you for your message!',
            },
            info: {
                title: 'Contact Info',
                email: '📧 Email',
                phone: '📱 Phone',
                address: '🏢 Address',
                addressLine: '123 Animal Rescue Ave, Pet City, PC 12345',
                hours: '⏰ Hours',
                hoursValue: '24/7 Emergency Support',
            },
        },

        // Footer
        footer: {
            tagline: 'Connecting communities to save animal lives in emergencies.',
            quickLinks: 'Quick Links',
            links: {
                home: 'Home',
                about: 'About Us',
                contact: 'Contact',
                faq: 'FAQ',
                admin: 'Admin Portal',
            },
            resources: 'Resources',
            resourceLinks: {
                partners: 'Rescue Partners',
                care: 'Animal Care Tips',
                safety: 'Safety Guide',
                blog: 'Blog',
            },
            legal: 'Legal',
            legalLinks: {
                privacy: 'Privacy Policy',
                terms: 'Terms of Service',
                disclaimer: 'Disclaimer',
            },
            copyright: '© 2026 PawSafe. All rights reserved. 🐾',
            hotline: 'Emergency Hotline',
            hotlineValue: '+919040959368',
            available: 'Available 24/7',
        },

        // FAB
        // NGO Finder
        donate: {
            tag: 'Support Our Animals',
            heading: 'Make a Difference Today',
            subtitle: 'Your donation directly feeds, heals and shelters rescued animals',
            tabOneTime: 'One-Time Donation',
            tabMonthly: 'Monthly Subscription',
            chooseCause: 'Choose a cause',
            chooseAmount: 'Choose amount',
            customPlaceholder: 'Enter any amount (min. ₹1)',
            choosePlan: 'Choose your plan',
            causes: { food: 'Animal Food', medical: 'Medical Care', shelter: 'Shelter', general: 'General Fund' },
            donateNow: 'Donate Now',
            subscribe: 'Subscribe Now',
            month: 'mo',
            popular: '⭐ Most Popular',
            subNote: 'Cancel anytime. No hidden charges. UPI / Card / Net Banking accepted.',
            plans: {
                basic: { name: 'Basic Care', perks: ['Feeds 2 animals/day', 'Monthly impact report', 'Donor certificate'] },
                care: { name: 'Animal Care', perks: ['Feeds 6 animals/day', 'Vet fund contribution', 'Priority updates', 'Digital badge'] },
                guardian: { name: 'Guardian', perks: ['Feeds 15 animals/day', 'Sponsor a rescue', 'Name on donor wall', 'Tax receipt'] },
            },
            impact: {
                food: 'feeds a stray for a day',
                medical: 'covers basic vet checkup',
                shelter: 'one week shelter cost',
                care: 'full monthly care package',
            },
            thankyouHeading: 'Thank you so much! 🐾',
            thankyouOneTime: 'Your donation of {amount} for {cause} will save lives!',
            thankyouSub: 'You\'re now a {plan} subscriber. Animals thank you!',
            thankyouNote: 'A confirmation has been sent to your email.',
            thankyouClose: 'Close',
        },
        ngo: {
            tag: 'Find Rescue Centres',
            heading: 'Nearby NGOs & Rescue Centres',
            subtitle: 'Verified animal rescue organisations near you',
            filterCity: 'City',
            filter247: '24/7 Only',
            filterAmbulance: 'Ambulance',
            filterWildlife: 'Wildlife',
            found: 'centres found',
            reviews: 'reviews',
            callNow: 'Call Now',
            noResults: 'No centres match your filters. Try adjusting them.',
            staffPortal: '🔐 Staff Portal',
        },
        support: {
            tag: 'Support a Rescue',
            heading: 'Animals Need Your Help',
            subtitle: 'Every donation, big or small, saves a life',
            required: '₹ Required',
            raised: '₹ Raised',
            funded: 'Funded',
            toGo: 'to go',
            donateNow: 'Donate Now',
            donateFor: 'Donate for',
            customAmount: 'Enter custom amount (₹)',
            thankYou: 'Thank you for donating ₹',
            for: 'for',
            critical: '🔴 Critical',
            urgent: '🟠 Urgent',
            moderate: '🟢 Stable',
        },
        stats: {
            live: 'LIVE',
            heading: 'Live Rescue Counter',
            subtitle: 'Real-time impact across our network',
            rescued: 'Animals Rescued Today',
            active: 'Active Rescue Requests',
            ngos: 'Verified NGOs',
            volunteers: 'Active Volunteers',
        },
        fab: { label: 'EMERGENCY' },
        readyToHelp: {
            tag: '🤝 Get Involved',
            heading: 'Ready to Help? 🐾',
            subtitle: 'Join 12,400+ Indians protecting animals — as a rescuer, donor, or field reporter',
            stats: {
                volunteers: 'Volunteers',
                rescues: 'Rescues',
                partners: 'NGO Partners',
                states: 'States'
            },
            roles: [
                {
                    title: 'Volunteer Rescuer',
                    desc: 'Accept nearby emergency cases, help transport injured animals, and assist NGOs on ground.',
                    perks: ['Get real-time rescue alerts', 'Navigate to emergency locations', 'Track animals you\'ve helped'],
                    cta: 'Join as Volunteer'
                },
                {
                    title: 'Donor',
                    desc: 'Fund food, medical treatment, shelter, and emergency care for rescued animals across India.',
                    perks: ['One-time or monthly options', 'Choose your cause', 'Get impact reports'],
                    cta: 'Start Donating'
                },
                {
                    title: 'Field Reporter',
                    desc: 'Spot injured or distressed animals on the street? Report them instantly so rescue teams can respond.',
                    perks: ['File reports in 60 seconds', 'Share live location & photos', 'Get status updates'],
                    cta: 'Report an Emergency'
                }
            ],
            banner: {
                title: 'Not sure where to start?',
                desc: 'Register in 60 seconds — we\'ll match you with the right role based on your skills and availability.',
                cta: '✍️ Quick Registration'
            },
            testimonials: {
                heading: '💬 What our community says',
                items: [
                    { name: 'Divya R.', city: 'Bengaluru', role: 'Volunteer Rescuer', quote: 'I rescued my first injured dog in 20 minutes using PawSafe. The step-by-step guidance made it so easy.' },
                    { name: 'Karan M.', city: 'Mumbai', role: 'Monthly Donor', quote: 'Seeing Bruno\'s recovery tracker update every few days is the best feeling. Worth every rupee.' },
                    { name: 'Sunita P.', city: 'Chennai', role: 'Field Reporter', quote: 'I reported a snake-bite case near my office. Rescue team arrived in 15 mins. Amazing platform!' }
                ]
            },
            skills: {
                transport: { label: '🚗 Can Transport', desc: 'Have a vehicle to move animals' },
                firstaid: { label: '🩺 First Aid', desc: 'Know basic animal first aid' },
                foster: { label: '🏠 Can Foster', desc: 'Temporarily home an animal' },
                document: { label: '📸 Can Document', desc: 'Photo/video evidence at scene' },
                vet: { label: '👨‍⚕️ Vet / Para-vet', desc: 'Medical background' },
                fundraise: { label: '💰 Fundraiser', desc: 'Spread awareness & raise funds' }
            },
            availability: ['Weekends Only', 'Weekday Evenings', 'Anytime', 'On-Call Emergencies Only'],
            form: {
                heading: '🐾 Join PawSafe',
                subtext: 'Quick 60-second sign-up. No experience needed.',
                name: 'Full Name *',
                city: 'City *',
                phone: 'Phone *',
                availLabel: 'Availability',
                skillsLabel: 'What can you do? (select all that apply)',
                submit: '🐾 Register Now — It\'s Free',
                success: {
                    title: 'Welcome to the PawSafe family!',
                    msg: 'Hi {name}! Your registration is confirmed. We\'ll reach out to you in {city} when there\'s a rescue near you.',
                    note: '📱 Download our app (coming soon) to get live alerts.',
                    done: 'Done'
                }
            }
        }
    },

    // ─────────────── हिंदी ───────────────
    hi: {
        nav: { home: 'होम', about: 'हमारे बारे में', contact: 'संपर्क' },
        header: {
            login: '🔑 लॉगिन',
            volunteer: '🤝 स्वयंसेवक',
            emergency: '🚨 आपातकाल',
            groups: {
                rescue: '🐾 बचाव',
                community: '🤝 समुदाय',
                info: 'ℹ️ जानकारी',
            }
        },
        hero: {
            title: 'पशु आपातकालीन बचाव',
            brandLine: 'के साथ',
            subtitle: 'तुरंत पशु आपातकाल की रिपोर्ट करें। अपने क्षेत्र के बचाव दल से जुड़ें। मिलकर जीवन बचाएं।',
            report: 'आपातकाल रिपोर्ट करें',
            learnMore: 'और जानें',
            trustedBy: '10,000+ पालतू मालिकों का भरोसा',
        },
        features: {
            heading: 'PawSafe क्यों चुनें',
            subtitle: 'पशुओं की जान बचाने के लिए शक्तिशाली सुविधाएं',
            items: [
                { icon: '📍', title: 'रियल-टाइम लोकेशन', description: 'त्वरित बचाव के लिए सटीक GPS निर्देशांक साझा करें' },
                { icon: '📸', title: 'फोटो प्रमाण', description: 'पशु की पहचान में मदद के लिए चित्र कैप्चर करें' },
                { icon: '👥', title: 'सामुदायिक नेटवर्क', description: 'पेशेवर बचावकर्मियों और स्वयंसेवकों से जुड़ें' },
                { icon: '⏱️', title: 'त्वरित प्रतिक्रिया', description: 'तत्काल कार्रवाई के लिए 24/7 आपातकालीन अलर्ट' },
                { icon: '📱', title: 'मोबाइल फर्स्ट', description: 'त्वरित रिपोर्टिंग के लिए उपयोग में आसान ऐप' },
                { icon: '📊', title: 'केस ट्रैकिंग', description: 'बचाव का अनुसरण करें और पशु की रिकवरी ट्रैक करें' },
            ],
        },
        howItWorks: {
            heading: 'यह कैसे काम करता है',
            subtitle: 'जीवन बचाने के सरल चरण',
            steps: [
                { number: '1', title: 'रिपोर्ट करें', description: 'आपातकालीन बटन टैप करें और पशु के बारे में विवरण साझा करें' },
                { number: '2', title: 'स्थान साझा करें', description: 'बचावकर्मियों को पशु ढूंढने में मदद के लिए GPS और फोटो दें' },
                { number: '3', title: 'नेटवर्क को अलर्ट करें', description: 'आपकी रिपोर्ट तुरंत पास के बचाव पेशेवरों को भेजी जाती है' },
                { number: '4', title: 'बचाव', description: 'प्रशिक्षित बचावकर्मी जल्दी से पशु को बचाते हैं और देखभाल करते हैं' },
            ],
            cta: { title: 'मदद के लिए तैयार हैं?', subtitle: 'हर दिन फर्क करने वाले हजारों पशु प्रेमियों से जुड़ें', button: 'अभी शुरू करें' },
        },
        about: {
            heading: 'PawSafe के बारे में',
            p1: 'PawSafe एक सामुदायिक आपातकालीन प्रतिक्रिया मंच है जो संकट में पड़े पशुओं को बचाने के लिए समर्पित है।',
            mission: 'हमारा मिशन',
            p2: 'प्रत्येक पशु सुरक्षा और देखभाल का हकदार है। जब कोई पशु खतरे में हो, तो समय बहुत महत्वपूर्ण है।',
            difference: 'हम कैसे फर्क करते हैं',
            list: [
                '📍 त्वरित प्रतिक्रिया के लिए रियल-टाइम लोकेशन शेयरिंग',
                '👥 पशु प्रेमियों और पेशेवरों का सामुदायिक नेटवर्क',
                '📱 उपयोग में आसान मोबाइल-फर्स्ट प्लेटफॉर्म',
                '🚨 तत्काल कार्रवाई के लिए आपातकालीन अलर्ट सिस्टम',
                '📊 ट्रैकिंग और फॉलो-अप देखभाल समन्वय',
            ],
        },
        contact: {
            heading: 'संपर्क करें',
            form: { title: 'हमें संदेश भेजें', name: 'आपका नाम', email: 'आपका ईमेल', message: 'आपका संदेश', send: 'संदेश भेजें', success: 'आपके संदेश के लिए धन्यवाद!' },
            info: { title: 'संपर्क जानकारी', email: '📧 ईमेल', phone: '📱 फ़ोन', address: '🏢 पता', addressLine: '123 एनिमल रेस्क्यू एवेन्यू, पेट सिटी', hours: '⏰ समय', hoursValue: '24/7 आपातकालीन सहायता' },
        },
        footer: {
            tagline: 'आपातकाल में पशुओं की जान बचाने के लिए समुदायों को जोड़ना।',
            quickLinks: 'त्वरित लिंक',
            links: { home: 'होम', about: 'हमारे बारे में', contact: 'संपर्क', faq: 'अक्सर पूछे जाने वाले प्रश्न', admin: 'एडमिन पोर्टल' },
            resources: 'संसाधन',
            resourceLinks: { partners: 'बचाव साझेदार', care: 'पशु देखभाल टिप्स', safety: 'सुरक्षा गाइड', blog: 'ब्लॉग' },
            legal: 'कानूनी',
            legalLinks: { privacy: 'गोपनीयता नीति', terms: 'सेवा की शर्तें', disclaimer: 'अस्वीकरण' },
            copyright: '© 2026 PawSafe. सर्वाधिकार सुरक्षित। 🐾',
            hotline: 'आपातकालीन हॉटलाइन',
            hotlineValue: '+919040959368',
            available: '24/7 उपलब्ध',
        },
        donate: {
            tag: 'जानवरों की मदद करें',
            heading: 'आज एक फर्क डालें',
            subtitle: 'आपका दान सीधे जानवरों को खाना, इलाज और आश्रय देता है',
            tabOneTime: 'एकमुश्त दान',
            tabMonthly: 'मासिक सदस्यता',
            chooseCause: 'कारण चुनें',
            chooseAmount: 'राशि चुनें',
            customPlaceholder: 'कोई भी राशि (न्यूनतम ₹1)',
            choosePlan: 'योजना चुनें',
            causes: { food: 'पशु भोजन', medical: 'चिकित्सा', shelter: 'आश्रय', general: 'सामान्य निधि' },
            donateNow: 'दान करें',
            subscribe: 'सदस्यता लें',
            month: 'माह',
            popular: '⭐ सबसे लोकप्रिय',
            subNote: 'कभी भी रद्द करें। कोई छिपा शुल्क नहीं। UPI / कार्ड / नेट बैंकिंग।',
            plans: {
                basic: { name: 'बेसिक केयर', perks: ['2 जानवरों को खाना/दिन', 'मासिक रिपोर्ट', 'दाता प्रमाण पत्र'] },
                care: { name: 'एनिमल केयर', perks: ['6 जानवरों को खाना/दिन', 'पशु चिकित्सा योगदान', 'प्राथमिकता अपडेट', 'डिजिटल बैज'] },
                guardian: { name: 'गार्जियन', perks: ['15 जानवरों को खाना/दिन', 'रेस्क्यू प्रायोजित करें', 'दाता दीवार पर नाम', 'कर रसीद'] },
            },
            impact: { food: 'एक दिन एक आवारा को खिलाता है', medical: 'बुनियादी पशु चिकित्सा', shelter: 'एक सप्ताह आश्रय', care: 'मासिक देखभाल पैकेज' },
            thankyouHeading: 'बहुत धन्यवाद! 🐾',
            thankyouOneTime: '{cause} के लिए {amount} का दान जीवन बचाएगा!',
            thankyouSub: 'आप {plan} सदस्य बन गए। जानवर आपका धन्यवाद करते हैं!',
            thankyouNote: 'पुष्टि आपके ईमेल पर भेजी गई है।',
            thankyouClose: 'बंद करें',
        },
        ngo: {
            tag: 'रेस्क्यू सेंटर खोजें',
            heading: 'नजदीकी NGO और रेस्क्यू सेंटर',
            subtitle: 'आपके नजदीक सत्यापित पशु बचाव संगठन',
            filterCity: 'शहर',
            filter247: 'सिर्फ 24/7',
            filterAmbulance: 'एम्बुलेंस',
            filterWildlife: 'वन्यजीव',
            found: 'सेंटर मिले',
            reviews: 'समीक्षाएं',
            callNow: 'अभी कॉल करें',
            noResults: 'कोई परिणाम नहीं मिला। फ़िल्टर बदलें।',
            staffPortal: '🔐 स्टाफ पोर्टल',
        },
        support: {
            tag: 'बचाव में सहायता करें',
            heading: 'पशुओं को आपकी मदद चाहिए',
            subtitle: 'हर दान, बड़ा या छोटा, एक जीवन बचाता है',
            required: '₹ आवश्यक',
            raised: '₹ जुटाए गए',
            funded: 'प्राप्त',
            toGo: 'बाकी',
            donateNow: 'दान करें',
            donateFor: 'दान करें',
            customAmount: 'कस्टम राशि दर्ज करें (₹)',
            thankYou: 'धन्यवाद ₹',
            for: 'के लिए',
            critical: '🔴 गंभीर',
            urgent: '🟠 अत्यावश्यक',
            moderate: '🟢 स्थिर',
        },
        stats: {
            live: 'लाइव',
            heading: 'लाइव बचाव काउंटर',
            subtitle: 'हमारे नेटवर्क पर वास्तविक समय का प्रभाव',
            rescued: 'आज बचाए गए पशु',
            active: 'सक्रिय बचाव अनुरोध',
            ngos: 'सत्यापित NGOs',
            volunteers: 'सक्रिय स्वयंसेवक',
        },
        fab: { label: 'आपातकाल' },
        readyToHelp: {
            tag: '🤝 शामिल हों',
            heading: 'मदद के लिए तैयार हैं? 🐾',
            subtitle: '12,400+ भारतीयों से जुड़ें जो जानवरों की रक्षा कर रहे हैं — एक बचावकर्ता, दाता, या फील्ड रिपोर्टर के रूप में',
            stats: {
                volunteers: 'स्वयंसेवक',
                rescues: 'बचाव',
                partners: 'NGO पार्टनर्स',
                states: 'राज्य'
            },
            roles: [
                {
                    title: 'स्वयंसेवक बचावकर्ता',
                    desc: 'आस-पास के आपातकालीन मामलों को स्वीकार करें, घायल जानवरों के परिवहन में मदद करें, और जमीन पर NGO की सहायता करें।',
                    perks: ['रियल-टाइम बचाव अलर्ट प्राप्त करें', 'आपातकालीन स्थानों पर नेविगेट करें', 'उन जानवरों को ट्रैक करें जिनकी आपने मदद की है'],
                    cta: 'स्वयंसेवक के रूप में जुड़ें'
                },
                {
                    title: 'दाता',
                    desc: 'पूरे भारत में बचाए गए जानवरों के लिए भोजन, चिकित्सा उपचार, आश्रय और आपातकालीन देखभाल के लिए धन दें।',
                    perks: ['एकमुश्त या मासिक विकल्प', 'अपना कारण चुनें', 'प्रभाव रिपोर्ट प्राप्त करें'],
                    cta: 'दान देना शुरू करें'
                },
                {
                    title: 'फील्ड रिपोर्टर',
                    desc: 'सड़क पर घायल या संकट में पड़े जानवरों को देखें? तुरंत उनकी रिपोर्ट करें ताकि बचाव दल प्रतिक्रिया दे सके।',
                    perks: ['60 सेकंड में रिपोर्ट दर्ज करें', 'लाइव लोकेशन और फोटो साझा करें', 'स्थिति अपडेट प्राप्त करें'],
                    cta: 'आपातकाल की रिपोर्ट करें'
                }
            ],
            banner: {
                title: 'पता नहीं कहाँ से शुरू करें?',
                desc: '60 सेकंड में पंजीकरण करें — हम आपके कौशल और उपलब्धता के आधार पर आपको सही भूमिका से मिलाएंगे।',
                cta: '✍️ त्वरित पंजीकरण'
            },
            testimonials: {
                heading: '💬 हमारा समुदाय क्या कहता है',
                items: [
                    { name: 'दिव्या आर.', city: 'बेंगलुरु', role: 'स्वयंसेवक बचावकर्ता', quote: 'मैंने पॉसेफ का उपयोग करके 20 मिनट में अपने पहले घायल कुत्ते को बचाया। चरण-दर-चरण मार्गदर्शन ने इसे बहुत आसान बना दिया।' },
                    { name: 'करण एम.', city: 'मुंबई', role: 'मासिक दाता', quote: 'हर कुछ दिनों में ब्रूनो के रिकवरी ट्रैकर अपडेट को देखना सबसे अच्छा अहसास है। हर रुपया सार्थक है।' },
                    { name: 'सुनीता पी.', city: 'चेन्नई', role: 'फील्ड रिपोर्टर', quote: 'मैंने अपने कार्यालय के पास सांप के काटने के मामले की सूचना दी। बचाव दल 15 मिनट में पहुंच गया। अद्भुत मंच!' }
                ]
            },
            skills: {
                transport: { label: '🚗 परिवहन कर सकते हैं', desc: 'जानवरों को ले जाने के लिए वाहन है' },
                firstaid: { label: '🩺 प्राथमिक चिकित्सा', desc: 'बुनियादी पशु प्राथमिक चिकित्सा जानते हैं' },
                foster: { label: '🏠 अस्थायी घर', desc: 'अस्थायी रूप से जानवर को घर दे सकते हैं' },
                document: { label: '📸 दस्तावेजीकरण', desc: 'दृश्य पर फोटो/वीडियो साक्ष्य' },
                vet: { label: '👨‍⚕️ पशु चिकित्सक', desc: 'चिकित्सा पृष्ठभूमि' },
                fundraise: { label: '💰 धन उगाहना', desc: 'जागरूकता फैलाएं और धन जुटाएं' }
            },
            availability: ['केवल सप्ताहांत', 'सप्ताह के दिनों की शाम', 'कभी भी', 'केवल ऑन-कॉल आपातकाल'],
            form: {
                heading: '🐾 पॉसेफ से जुड़ें',
                subtext: 'त्वरित 60-सेकंड का साइन-अप। किसी अनुभव की आवश्यकता नहीं है।',
                name: 'पूरा नाम *',
                city: 'शहर *',
                phone: 'फोन *',
                availLabel: 'उपलब्धता',
                skillsLabel: 'आप क्या कर सकते हैं? (उन सभी को चुनें जो लागू होते हैं)',
                submit: '🐾 अभी पंजीकरण करें — यह मुफ़्त है',
                success: {
                    title: 'पॉसेफ परिवार में आपका स्वागत है!',
                    msg: 'नमस्ते {name}! आपका पंजीकरण पुष्ट हो गया है। जब आपके पास कोई बचाव होगा तो हम {city} में आपसे संपर्क करेंगे।',
                    note: '📱 लाइव अलर्ट प्राप्त करने के लिए हमारा ऐप (जल्द ही आ रहा है) डाउनलोड करें।',
                    done: 'हो गया'
                }
            }
        }
    },

    // ─────────────── தமிழ் ───────────────
    ta: {
        nav: { home: 'முகப்பு', about: 'எங்களைப் பற்றி', contact: 'தொடர்பு' },
        header: {
            login: '🔑 உள்நுழை',
            volunteer: '🤝 தன்னார்வலர்',
            emergency: '🚨 அவசரநிலை',
            groups: {
                rescue: '🐾 மீட்பு',
                community: '🤝 சமூகம்',
                info: 'ℹ️ தகவல்',
            }
        },
        hero: {
            title: 'விலங்கு அவசர மீட்பு',
            brandLine: 'உடன்',
            subtitle: 'உடனடியாக விலங்கு அவசரநிலையை அறிவிக்கவும். உங்கள் பகுதியில் மீட்பாளர்களுடன் இணையுங்கள். உயிர்களை காப்போம்.',
            report: 'அவசரநிலை அறிவிக்கவும்',
            learnMore: 'மேலும் அறிய',
            trustedBy: '10,000+ செல்லப்பிராணி உரிமையாளர்களால் நம்பப்படுகிறது',
        },
        features: {
            heading: 'PawSafe ஏன் தேர்வு செய்யலாம்',
            subtitle: 'விலங்கு உயிர்களை காப்பாற்ற வடிவமைக்கப்பட்ட சக்திவாய்ந்த அம்சங்கள்',
            items: [
                { icon: '📍', title: 'நேரடி இருப்பிடம்', description: 'விரைவான மீட்புக்கு சரியான GPS ஒருங்கிணைப்புகளை பகிரவும்' },
                { icon: '📸', title: 'புகைப்பட சான்று', description: 'விலங்கை அடையாளம் காண மீட்பாளர்களுக்கு படங்கள் எடுக்கவும்' },
                { icon: '👥', title: 'சமூக வலையமைப்பு', description: 'தொழில்முறை மீட்பாளர்கள் மற்றும் தன்னார்வலர்களுடன் இணையுங்கள்' },
                { icon: '⏱️', title: 'விரைவான பதில்', description: 'உடனடி நடவடிக்கைக்கு 24/7 அவசர எச்சரிக்கை அமைப்பு' },
                { icon: '📱', title: 'மொபைல் ஃபர்ஸ்ட்', description: 'விரைவான அறிக்கைக்கு எளிதான பயன்பாடு' },
                { icon: '📊', title: 'வழக்கு கண்காணிப்பு', description: 'மீட்புகளை கண்காணித்து விலங்கு குணமடைவை பின்தொடரவும்' },
            ],
        },
        howItWorks: {
            heading: 'இது எப்படி செயல்படுகிறது',
            subtitle: 'உயிரை காப்பாற்ற எளிய படிகள்',
            steps: [
                { number: '1', title: 'அறிவிக்கவும்', description: 'அவசர பொத்தானை தட்டி துன்பத்தில் இருக்கும் விலங்கு பற்றிய விவரங்களை பகிரவும்' },
                { number: '2', title: 'இருப்பிடம் பகிரவும்', description: 'மீட்பாளர்களுக்கு உதவ GPS மற்றும் புகைப்படங்களை வழங்கவும்' },
                { number: '3', title: 'வலையமைப்பை எச்சரிக்கவும்', description: 'உங்கள் அறிக்கை உடனடியாக அருகிலுள்ள மீட்பு நிபுணர்களுக்கு அனுப்பப்படும்' },
                { number: '4', title: 'மீட்பு', description: 'பயிற்றுவிக்கப்பட்ட மீட்பாளர்கள் விலங்கை காப்பாற்ற விரைந்து செல்கிறார்கள்' },
            ],
            cta: { title: 'உதவ தயாரா?', subtitle: 'தினமும் மாற்றம் ஏற்படுத்தும் ஆயிரக்கணக்கான விலங்கு காதலர்களுடன் இணையுங்கள்', button: 'இப்போதே தொடங்குங்கள்' },
        },
        about: {
            heading: 'PawSafe பற்றி',
            p1: 'PawSafe என்பது ஒரு சமூக அடிப்படையிலான அவசர மீட்பு தளம் ஆகும், இது துன்பத்தில் உள்ள விலங்குகளை காப்பாற்றுவதற்காக அர்ப்பணிக்கப்பட்டுள்ளது.',
            mission: 'எங்கள் நோக்கம்',
            p2: 'ஒவ்வொரு விலங்கும் பாதுகாப்பு மற்றும் கவனிப்புக்கு தகுதியானது. ஒரு விலங்கு ஆபத்தில் இருக்கும்போது, நேரம் மிக முக்கியமானது.',
            difference: 'நாங்கள் எப்படி மாற்றம் செய்கிறோம்',
            list: [
                '📍 விரைவான மீட்புக்கு நேரடி இருப்பிட பகிர்வு',
                '👥 விலங்கு காதலர்கள் மற்றும் நிபுணர்களின் சமூக வலையமைப்பு',
                '📱 எளிதான மொபைல்-ஃபர்ஸ்ட் தளம்',
                '🚨 உடனடி நடவடிக்கைக்கு அவசர எச்சரிக்கை அமைப்பு',
                '📊 கண்காணிப்பு மற்றும் தொடர்ச்சியான கவனிப்பு ஒருங்கிணைப்பு',
            ],
        },
        contact: {
            heading: 'தொடர்பு கொள்ளுங்கள்',
            form: { title: 'எங்களுக்கு செய்தி அனுப்பவும்', name: 'உங்கள் பெயர்', email: 'உங்கள் மின்னஞ்சல்', message: 'உங்கள் செய்தி', send: 'செய்தி அனுப்பவும்', success: 'உங்கள் செய்திக்கு நன்றி!' },
            info: { title: 'தொடர்பு தகவல்', email: '📧 மின்னஞ்சல்', phone: '📱 தொலைபேசி', address: '🏢 முகவரி', addressLine: '123 ஆனிமல் ரெஸ்க்யூ அவென்யூ', hours: '⏰ நேரம்', hoursValue: '24/7 அவசர ஆதரவு' },
        },
        footer: {
            tagline: 'அவசரநிலைகளில் விலங்கு உயிர்களை காப்பாற்ற சமூகங்களை இணைக்கிறோம்.',
            quickLinks: 'விரைவு இணைப்புகள்',
            links: { home: 'முகப்பு', about: 'எங்களைப் பற்றி', contact: 'தொடர்பு', faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்', admin: 'நிர்வாக மையம்' },
            resources: 'வளங்கள்',
            resourceLinks: { partners: 'மீட்பு கூட்டாளர்கள்', care: 'விலங்கு பராமரிப்பு குறிப்புகள்', safety: 'பாதுகாப்பு வழிகாட்டி', blog: 'வலைப்பதிவு' },
            legal: 'சட்டப்பூர்வம்',
            legalLinks: { privacy: 'தனியுரிமை கொள்கை', terms: 'சேவை விதிமுறைகள்', disclaimer: 'மறுப்பு' },
            copyright: '© 2026 PawSafe. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. 🐾',
            hotline: 'அவசர ஹாட்லைன்',
            hotlineValue: '+919040959368',
            available: '24/7 கிடைக்கும்',
        },
        donate: {
            tag: 'விலங்குகளுக்கு உதவுங்கள்',
            heading: 'இன்று மாற்றத்தை உருவாக்குங்கள்',
            subtitle: 'உங்கள் நன்கொடை விலங்குகளுக்கு நேரடியாக உதவுகிறது',
            tabOneTime: 'ஒருமுறை நன்கொடை',
            tabMonthly: 'மாதாந்திர சந்தா',
            chooseCause: 'காரணம் தேர்ந்தெடுக்கவும்',
            chooseAmount: 'தொகை தேர்ந்தெடுக்கவும்',
            customPlaceholder: 'எந்த தொகையும் (குறைந்தது ₹1)',
            choosePlan: 'திட்டம் தேர்ந்தெடுக்கவும்',
            causes: { food: 'விலங்கு உணவு', medical: 'மருத்துவம்', shelter: 'தங்குமிடம்', general: 'பொது நிதி' },
            donateNow: 'நன்கொடை',
            subscribe: 'சந்தா செலுத்துங்கள்',
            month: 'மாதம்',
            popular: '⭐ மிகவும் பிரபலமானது',
            subNote: 'எப்போதும் ரத்து செய்யலாம். மறைக்கப்பட்ட கட்டணம் இல்லை.',
            plans: {
                basic: { name: 'அடிப்படை', perks: ['2 விலங்குகளுக்கு உணவு/நாள்', 'மாதாந்திர அறிக்கை', 'சான்றிதழ்'] },
                care: { name: 'விலங்கு பராமரிப்பு', perks: ['6 விலங்குகளுக்கு உணவு/நாள்', '獣医நிதி', 'முன்னுரிமை', 'டிஜிட்டல் பேட்ஜ்'] },
                guardian: { name: 'பாதுகாவலர்', perks: ['15 விலங்குகளுக்கு உணவு/நாள்', 'மீட்பை ஆதரிக்கவும்', 'நன்கொடையாளர் சுவர்', 'வரி ரசீது'] },
            },
            impact: { food: 'ஒரு நாள் ஒரு தெருநாயை உணவளிக்கிறது', medical: 'அடிப்படை மருத்துவம்', shelter: 'ஒரு வார தங்குமிடம்', care: 'மாதாந்திர பராமரிப்பு' },
            thankyouHeading: 'மிக்க நன்றி! 🐾',
            thankyouOneTime: '{cause} க்கு {amount} நன்கொடை உயிரை காப்பாற்றும்!',
            thankyouSub: 'நீங்கள் {plan} சந்தாதாரர் ஆனீர்கள்!',
            thankyouNote: 'உறுதிப்படுத்தல் உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது.',
            thankyouClose: 'மூடு',
        },
        ngo: {
            tag: 'மீட்பு மையங்களைக் கண்டுபிடி',
            heading: 'அருகிலுள்ள NGOகள் மற்றும் மீட்பு மையங்கள்',
            subtitle: 'உங்களுக்கு அருகிலுள்ள சரிபார்க்கப்பட்ட மீட்பு மையங்கள்',
            filterCity: 'நகரம்',
            filter247: 'மட்டும் 24/7',
            filterAmbulance: 'ஆம்புலன்ஸ்',
            filterWildlife: 'வன்விலங்கு',
            found: 'மையங்கள் கிடைத்தன',
            reviews: 'மதிப்புகள்',
            callNow: 'இப்போது அழைக்கவும்',
            noResults: 'உங்கள் வடிகட்டிக்கு பொருத்தமான மையங்கள் இல்லை.',
            staffPortal: '🔐 பணியாளர் மையம்',
        },
        support: {
            tag: 'மீட்புக்கு ஆதரவு',
            heading: 'விலங்குகளுக்கு உங்கள் உதவி தேவை',
            subtitle: 'ஒவ்வொரு நன்கொடையும் ஒரு உயிரை காப்பாற்றுகிறது',
            required: '₹ தேவை',
            raised: '₹ திரட்டப்பட்டது',
            funded: 'நிதியளிக்கப்பட்டது',
            toGo: 'மீதம்',
            donateNow: 'இப்போது நன்கொடை',
            donateFor: 'நன்கொடை',
            customAmount: 'தொகையை உள்ளிடவும் (₹)',
            thankYou: 'நன்கொடைக்கு நன்றி ₹',
            for: 'க்கு',
            critical: '🔴 அவசர',
            urgent: '🟠 உடன்',
            moderate: '🟢 நிலையான',
        },
        stats: {
            live: 'நேரடி',
            heading: 'நேரடி மீட்பு எண்ணிக்கை',
            subtitle: 'எங்கள் நெட்வொர்க்கில் நிகழ்நேர தாக்கம்',
            rescued: 'இன்று காப்பாற்றப்பட்ட விலங்குகள்',
            active: 'செயலில் உள்ள மீட்பு கோரிக்கைகள்',
            ngos: 'சரிபார்க்கப்பட்ட NGOக்கள்',
            volunteers: 'செயலில் உள்ள தன்னார்வலர்கள்',
        },
        fab: { label: 'அவசரநிலை' },
        readyToHelp: {
            tag: '🤝 இணைந்து கொள்ளுங்கள்',
            heading: 'உதவ தயாரா? 🐾',
            subtitle: 'விலங்குகளைப் பாதுகாக்கும் 12,400+ இந்தியர்களுடன் இணையுங்கள் - மீட்பவர், கொடையாளர் அல்லது கள செய்தியாளராக',
            stats: {
                volunteers: 'தன்னார்வலர்கள்',
                rescues: 'மீட்புகள்',
                partners: 'NGO கூட்டாளர்கள்',
                states: 'மாநிலங்கள்'
            },
            roles: [
                {
                    title: 'தன்னார்வ மீட்பாளர்',
                    desc: 'அருகிலுள்ள அவசர வழக்குகளை ஏற்றுக்கொள்வது, காயமடைந்த விலங்குகளை கொண்டு செல்ல உதவுவது மற்றும் களத்தில் NGO களுக்கு உதவுவது.',
                    perks: ['நேரடி மீட்பு எச்சரிக்கைகளைப் பெறுங்கள்', 'அவசர இடங்களுக்குச் செல்லுங்கள்', 'நீங்கள் உதவிய விலங்குகளைக் கண்காணிக்கவும்'],
                    cta: 'தன்னார்வலராக சேருங்கள்'
                },
                {
                    title: 'கொடையாளர்',
                    desc: 'இந்தியா முழுவதும் மீட்கப்பட்ட விலங்குகளுக்கு உணவு, மருத்துவ சிகிச்சை, தங்குமிடம் மற்றும் அவசர சிகிச்சைக்காக நிதி வழங்குதல்.',
                    perks: ['ஒருமுறை அல்லது மாதாந்திர விருப்பங்கள்', 'உங்கள் காரணத்தைத் தேர்வு செய்யவும்', 'தாக்க அறிக்கைகளைப் பெறவும்'],
                    cta: 'நன்கொடை வழங்கத் தொடங்குங்கள்'
                },
                {
                    title: 'கள செய்தியாளர்',
                    desc: 'தெருவில் காயமடைந்த அல்லது துன்பத்தில் இருக்கும் விலங்குகளைக் கண்டீர்களா? மீட்புக் குழுவினர் பதிலளிக்க உடனடியாக அவற்றைப் புகாரளிக்கவும்.',
                    perks: ['60 வினாடிகளில் அறிக்கைகளைத் தாக்கல் செய்யுங்கள்', 'நேரடி இருப்பிடம் மற்றும் புகைப்படங்களைப் பகிரவும்', 'நிலை அறிவிப்புகளைப் பெறவும்'],
                    cta: 'அவசரநிலையைப் புகாரளிக்கவும்'
                }
            ],
            banner: {
                title: 'எங்கிருந்து தொடங்குவது என்று தெரியவில்லையா?',
                desc: '60 வினாடிகளில் பதிவு செய்யுங்கள் - உங்கள் திறமைகள் மற்றும் கிடைக்கும் தன்மையின் அடிப்படையில் சரியான பாத்திரத்துடன் நாங்கள் உங்களைப் பொருத்துவோம்.',
                cta: '✍️ விரைவான பதிவு'
            },
            testimonials: {
                heading: '💬 எங்கள் சமூகம் என்ன சொல்கிறது',
                items: [
                    { name: 'திவ்யா ஆர்.', city: 'பெங்களூரு', role: 'தன்னார்வ மீட்பாளர்', quote: 'பயனளிக்கும் பாஸேஃப் மூலம் 20 நிமிடங்களில் எனது முதல் காயமடைந்த நாயை மீட்டேன். படிப்படியாக வழிகாட்டுதல் அதை மிகவும் எளிதாக்கியது.' },
                    { name: 'கரன் எம்.', city: 'மும்பை', role: 'மாதாந்திர கொடையாளர்', quote: 'ஒவ்வொரு சில நாட்களுக்கும் புருனோவின் மீட்பு டிராக்கர் புதுப்பிப்பைப் பார்ப்பது சிறந்த உணர்வு. ஒவ்வொரு ரூபாய்க்கும் மதிப்புள்ளது.' },
                    { name: 'சுனிதா பி.', city: 'சென்னை', role: 'கள செய்தியாளர்', quote: 'எனது அலுவலகத்திற்கு அருகில் பாம்பு கடித்த வழக்கை நான் புகாரளித்தேன். மீட்புக் குழுவினர் 15 நிமிடங்களில் வந்தனர். அற்புதமான தளம்!' }
                ]
            },
            skills: {
                transport: { label: '🚗 போக்குவரத்து செய்ய முடியும்', desc: 'விலங்குகளை நகர்த்த வாகனம் உள்ளது' },
                firstaid: { label: '🩺 முதலுதவி', desc: 'அடிப்படை விலங்கு முதலுதவி தெரியும்' },
                foster: { label: '🏠 வளர்க்க முடியும்', desc: 'தற்காலிகமாக ஒரு விலங்குக்கு அடைக்கலம் கொடுக்க முடியும்' },
                document: { label: '📸 ஆவணப்படுத்த முடியும்', desc: 'சம்பவ இடத்தில் புகைப்படம்/வீடியோ ஆதாரம்' },
                vet: { label: '👨‍⚕️ கால்நடை மருத்துவர்', desc: 'மருத்துவ பின்னணி' },
                fundraise: { label: '💰 நிதி திரட்டுபவர்', desc: 'விழிப்புணர்வு பரப்புதல் மற்றும் நிதி திரட்டுதல்' }
            },
            availability: ['வார இறுதி நாட்கள் மட்டும்', 'வார நாள் மாலைநேரம்', 'எந்த நேரத்திலும்', 'அழைப்பில் அவசரநிலைகள் மட்டும்'],
            form: {
                heading: '🐾 பாஸேஃபில் இணையுங்கள்',
                subtext: 'விரைவான 60 வினாடி பதிவு. அனுபவம் தேவையில்லை.',
                name: 'முழு பெயர் *',
                city: 'நகரம் *',
                phone: 'தொலைபேசி *',
                availLabel: 'கிடைக்கும் தன்மை',
                skillsLabel: 'உங்களால் என்ன செய்ய முடியும்? (பொருந்தும் அனைத்தையும் தேர்ந்தெடுக்கவும்)',
                submit: '🐾 இப்போது பதிவு செய்யுங்கள் — இது இலவசம்',
                success: {
                    title: 'பாஸேஃப் குடும்பத்திற்கு வரவேற்கிறோம்!',
                    msg: 'வணக்கம் {name}! உங்கள் பதிவு உறுதி செய்யப்பட்டது. உங்கள் அருகில் மீட்பு இருக்கும்போது {city} இல் நாங்கள் உங்களைத் தொடர்புகொள்வோம்.',
                    note: '📱 நேரடி எச்சரிக்கைகளைப் பெற எங்கள் செயலியை (விரைவில் வருகிறது) பதிவிறக்கவும்.',
                    done: 'முடிந்தது'
                }
            }
        }
    },

    // ─────────────── తెలుగు ───────────────
    te: {
        nav: { home: 'హోమ్', about: 'మా గురించి', contact: 'సంప్రదింపు' },
        header: {
            login: '🔑 లాగిన్',
            volunteer: '🤝 స్వయంసేవకుడు',
            emergency: '🚨 అత్యవసర',
            groups: {
                rescue: '🐾 రక్షణ',
                community: '🤝 సంఘం',
                info: 'ℹ️ సమాచారం',
            }
        },
        hero: {
            title: 'జంతు అత్యవసర రక్షణ',
            brandLine: 'తో',
            subtitle: 'వెంటనే జంతు అత్యవసర పరిస్థితిని నివేదించండి. మీ ప్రాంతంలో రక్షకులతో కనెక్ట్ అవ్వండి. కలిసి జీవితాలను కాపాడండి.',
            report: 'అత్యవసర నివేదించండి',
            learnMore: 'మరింత తెలుసుకోండి',
            trustedBy: '10,000+ పెంపుడు జంతువుల యజమానుల నమ్మకం',
        },
        features: {
            heading: 'PawSafe ఎందుకు ఎంచుకోవాలి',
            subtitle: 'జంతువుల జీవితాలను కాపాడేందుకు రూపొందించిన శక్తివంతమైన ఫీచర్లు',
            items: [
                { icon: '📍', title: 'రియల్-టైమ్ లొకేషన్', description: 'వేగవంతమైన రక్షణకు ఖచ్చితమైన GPS కోఆర్డినేట్లు షేర్ చేయండి' },
                { icon: '📸', title: 'ఫోటో సాక్ష్యం', description: 'జంతువును గుర్తించడానికి రక్షకులకు చిత్రాలు క్యాప్చర్ చేయండి' },
                { icon: '👥', title: 'కమ్యూనిటీ నెట్‌వర్క్', description: 'ప్రొఫెషనల్ రక్షకులు మరియు వాలంటీర్లతో కనెక్ట్ అవ్వండి' },
                { icon: '⏱️', title: 'వేగవంతమైన ప్రతిస్పందన', description: 'తక్షణ చర్యకు 24/7 అత్యవసర హెచ్చరిక వ్యవస్థ' },
                { icon: '📱', title: 'మొబైల్ ఫస్ట్', description: 'త్వరిత నివేదన కోసం ఉపయోగించడానికి సులభమైన యాప్' },
                { icon: '📊', title: 'కేస్ ట్రాకింగ్', description: 'రక్షణలను అనుసరించి జంతువు కోలుకోవడాన్ని ట్రాక్ చేయండి' },
            ],
        },
        howItWorks: {
            heading: 'ఇది ఎలా పని చేస్తుంది',
            subtitle: 'జీవితాన్ని కాపాడే సాధారణ దశలు',
            steps: [
                { number: '1', title: 'నివేదించండి', description: 'అత్యవసర బటన్ నొక్కి జంతువు గురించి వివరాలు షేర్ చేయండి' },
                { number: '2', title: 'లొకేషన్ షేర్ చేయండి', description: 'రక్షకులకు జంతువును కనుగొనడంలో సహాయం చేయడానికి GPS మరియు ఫోటోలు అందించండి' },
                { number: '3', title: 'నెట్‌వర్క్‌కు హెచ్చరించండి', description: 'మీ నివేదిక వెంటనే సమీపంలోని రక్షణ నిపుణులకు పంపబడుతుంది' },
                { number: '4', title: 'రక్షణ', description: 'శిక్షణ పొందిన రక్షకులు జంతువును కాపాడేందుకు త్వరగా స్పందిస్తారు' },
            ],
            cta: { title: 'సహాయం చేయడానికి సిద్ధంగా ఉన్నారా?', subtitle: 'ప్రతిరోజూ తేడా తీసుకొచ్చే వేలాది జంతు ప్రేమికులతో చేరండి', button: 'ఇప్పుడే ప్రారంభించండి' },
        },
        about: {
            heading: 'PawSafe గురించి',
            p1: 'PawSafe అనేది ఇబ్బందిలో ఉన్న జంతువులను రక్షించడానికి అంకితమైన సమాజ-ఆధారిత అత్యవసర ప్రతిస్పందన వేదిక.',
            mission: 'మా లక్ష్యం',
            p2: 'ప్రతి జంతువూ భద్రత మరియు సంరక్షణకు అర్హమైనది. జంతువు ప్రమాదంలో ఉన్నప్పుడు, సమయం చాలా ముఖ్యమైనది.',
            difference: 'మేము ఎలా తేడా తీసుకొస్తాం',
            list: [
                '📍 వేగవంతమైన ప్రతిస్పందన కోసం రియల్-టైమ్ లొకేషన్ షేరింగ్',
                '👥 జంతు ప్రేమికులు మరియు నిపుణుల కమ్యూనిటీ నెట్‌వర్క్',
                '📱 ఉపయోగించడానికి సులభమైన మొబైల్-ఫస్ట్ ప్లాట్‌ఫారమ్',
                '🚨 తక్షణ చర్యకు అత్యవసర హెచ్చరిక వ్యవస్థ',
                '📊 ట్రాకింగ్ మరియు ఫాలో-అప్ సంరక్షణ సమన్వయం',
            ],
        },
        contact: {
            heading: 'సంప్రదించండి',
            form: { title: 'మాకు సందేశం పంపండి', name: 'మీ పేరు', email: 'మీ ఇమెయిల్', message: 'మీ సందేశం', send: 'సందేశం పంపండి', success: 'మీ సందేశానికి ధన్యవాదాలు!' },
            info: { title: 'సంప్రదింపు సమాచారం', email: '📧 ఇమెయిల్', phone: '📱 ఫోన్', address: '🏢 చిరునామా', addressLine: '123 యానిమల్ రెస్క్యూ అవెన్యూ', hours: '⏰ గంటలు', hoursValue: '24/7 అత్యవసర మద్దతు' },
        },
        footer: {
            tagline: 'అత్యవసర పరిస్థితుల్లో జంతువుల జీవితాలను కాపాడేందుకు సమాజాలను కనెక్ట్ చేస్తోంది.',
            quickLinks: 'త్వరిత లింక్‌లు',
            links: { home: 'హోమ్', about: 'మా గురించి', contact: 'సంప్రదింపు', faq: 'తరచుగా అడిగే ప్రశ్నలు', admin: 'అడ్మిన్ పోర్టల్' },
            resources: 'వనరులు',
            resourceLinks: { partners: 'రక్షణ భాగస్వాములు', care: 'జంతు సంరక్షణ చిట్కాలు', safety: 'సురక్షిత మార్గదర్శి', blog: 'బ్లాగ్' },
            legal: 'చట్టపరమైన',
            legalLinks: { privacy: 'గోప్యతా విధానం', terms: 'సేవా నిబంధనలు', disclaimer: 'నిరాకరణ' },
            copyright: '© 2026 PawSafe. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి. 🐾',
            hotline: 'అత్యవసర హాట్‌లైన్',
            hotlineValue: '+919040959368',
            available: '24/7 అందుబాటులో',
        },
        donate: {
            tag: 'జంతువులకు సహాయం',
            heading: 'నేడు మార్పు తీసుకురండి',
            subtitle: 'మీ విరాళం నేరుగా జంతువులకు సహాయపడుతుంది',
            tabOneTime: 'ఒకసారి విరాళం',
            tabMonthly: 'నెలవారీ సభ్యత్వం',
            chooseCause: 'కారణం ఎంచుకోండి',
            chooseAmount: 'మొత్తం ఎంచుకోండి',
            customPlaceholder: 'ఏ మొత్తమైనా (కనిష్టం ₹1)',
            choosePlan: 'ప్లాన్ ఎంచుకోండి',
            causes: { food: 'జంతు ఆహారం', medical: 'వైద్య సేవ', shelter: 'ఆశ్రయం', general: 'సాధారణ నిధి' },
            donateNow: 'విరాళమివ్వండి',
            subscribe: 'సభ్యత్వం తీసుకోండి',
            month: 'నెల',
            popular: '⭐ అత్యంత ప్రాచుర్యం',
            subNote: 'ఎప్పుడైనా రద్దు చేయవచ్చు. దాచిన రుసుము ఏదీ లేదు.',
            plans: {
                basic: { name: 'బేసిక్ కేర్', perks: ['రోజుకు 2 జంతువులకు ఆహారం', 'నెలవారీ నివేదన', 'దాత సర్టిఫికేట్'] },
                care: { name: 'యానిమల్ కేర్', perks: ['రోజుకు 6 జంతువులకు ఆహారం', 'వెటర్నరీ నిధి', 'ప్రాధాన్య అప్‌డేట్లు', 'డిజిటల్ బ్యాడ్జ్'] },
                guardian: { name: 'గార్డియన్', perks: ['రోజుకు 15 జంతువులకు ఆహారం', 'రెస్క్యూ స్పాన్సర్', 'దాత గోడపై పేరు', 'పన్ను రసీదు'] },
            },
            impact: { food: 'ఒక రోజు అనాధ జంతువుకు ఆహారం', medical: 'వెటర్నరీ చెకప్', shelter: 'ఒక వారం ఆశ్రయం', care: 'నెలవారీ సంరక్షణ ప్యాకేజీ' },
            thankyouHeading: 'చాలా ధన్యవాదాలు! 🐾',
            thankyouOneTime: '{cause} కోసం {amount} విరాళం జీవితాలను కాపాడుతుంది!',
            thankyouSub: 'మీరు {plan} సభ్యుడయ్యారు!',
            thankyouNote: 'నిర్ధారణ మీ ఇమెయిల్‌కు పంపబడింది.',
            thankyouClose: 'మూసివేయి',
        },
        ngo: {
            tag: 'రెస్క్యూ సెంటర్లు వెతకండి',
            heading: 'సమీపంలోని NGOలు & రెస్క్యూ సెంటర్లు',
            subtitle: 'మీకు సమీపంలో ధృవీకరించిన జంతు రక్షణ సంస్థలు',
            filterCity: 'నగరం',
            filter247: 'కేవలం 24/7',
            filterAmbulance: 'ఆంబులెన్స్',
            filterWildlife: 'వన్యమృగాలు',
            found: 'సెంటర్లు దొరికాయి',
            reviews: 'సమీక్షలు',
            callNow: 'ఇప్పుడు కాల్ చేయండి',
            noResults: 'మీ ఫిల్టర్లకు సెంటర్లు లేవు.',
            staffPortal: '🔐 స్టాఫ్ పోర్టల్',
        },
        support: {
            tag: 'రెస్క్యూకు సహాయం',
            heading: 'జంతువులకు మీ సహాయం అవసరం',
            subtitle: 'ప్రతి విరాళం ఒక జీవితాన్ని కాపాడుతుంది',
            required: '₹ అవసరం',
            raised: '₹ సేకరించారు',
            funded: 'నిధులు సేకరించారు',
            toGo: 'మిగిలింది',
            donateNow: 'విరాళమివ్వండి',
            donateFor: 'విరాళం',
            customAmount: 'మొత్తం నమోదు చేయండి (₹)',
            thankYou: 'విరాళానికి ధన్యవాదాలు ₹',
            for: 'కోసం',
            critical: '🔴 క్రిటికల్',
            urgent: '🟠 అత్యవసర',
            moderate: '🟢 స్థిరం',
        },
        stats: {
            live: 'లైవ్',
            heading: 'లైవ్ రెస్క్యూ కౌంటర్',
            subtitle: 'మా నెట్‌వర్క్‌లో రియల్-టైమ్ ప్రభావం',
            rescued: 'నేడు రక్షించిన జంతువులు',
            active: 'చురుకైన రక్షణ అభ్యర్థనలు',
            ngos: 'ధృవీకరించిన NGOలు',
            volunteers: 'చురుకైన స్వయంసేవకులు',
        },
        fab: { label: 'అత్యవసర' },
        readyToHelp: {
            tag: '🤝 పాల్గొనండి',
            heading: 'సహాయం చేయడానికి సిద్ధంగా ఉన్నారా? 🐾',
            subtitle: 'జంతువులను రక్షించే 12,400+ భారతీయులతో చేరండి — రక్షకుడు, దాత లేదా ఫీల్డ్ రిపోర్టర్‌గా',
            stats: {
                volunteers: 'స్వయంసేవకులు',
                rescues: 'రక్షణలు',
                partners: 'NGO భాగస్వాములు',
                states: 'రాష్ట్రాలు'
            },
            roles: [
                {
                    title: 'స్వయంసేవక రక్షకుడు',
                    desc: 'సమీపంలోని అత్యవసర కేసులను అంగీకరించండి, గాయపడిన జంతువులను రవాణా చేయడంలో సహాయపడండి మరియు క్షేత్రస్థాయిలో NGOలకు సహాయం చేయండి.',
                    perks: ['రియల్ టైమ్ రెస్క్యూ అలర్ట్‌లను పొందండి', 'అత్యవసర ప్రదేశాలకు నావిగేట్ చేయండి', 'మీరు సహాయం చేసిన జంతువులను ట్రాక్ చేయండి'],
                    cta: 'స్వయంసేవకుడిగా చేరండి'
                },
                {
                    title: 'దాత',
                    desc: 'భారతదేశం అంతటా రక్షించబడిన జంతువుల కోసం ఆహారం, వైద్య చికిత్స, ఆశ్రయం మరియు అత్యవసర సంరక్షణ కోసం నిధులు ఇవ్వండి.',
                    perks: ['ఒకసారి లేదా నెలవారీ ఎంపికలు', 'మీ కారణాన్ని ఎంచుకోండి', 'ప్రభావ నివేదికలను పొందండి'],
                    cta: 'విరాళం ఇవ్వడం ప్రారంభించండి'
                },
                {
                    title: 'ఫీల్డ్ రిపోర్టర్',
                    desc: 'వీధిలో గాయపడిన లేదా ఇబ్బందుల్లో ఉన్న జంతువులను చూశారా? వెంటనే వాటి గురించి నివేదించండి, తద్వారా రెస్క్యూ టీమ్‌లు స్పందించగలవు.',
                    perks: ['60 సెకన్లలో నివేదికలు ఫైల్ చేయండి', 'లైవ్ లొకేషన్ మరియు ఫోటోలను షేర్ చేయండి', 'స్టేటస్ అప్‌డేట్‌లను పొందండి'],
                    cta: 'అత్యవసరాన్ని నివేదించండి'
                }
            ],
            banner: {
                title: 'ఎక్కడ ప్రారంభించాలో తెలియదా?',
                desc: '60 సెకన్లలో నమోదు చేసుకోండి — మీ నైపుణ్యాలు మరియు లభ్యత ఆధారంగా మేము మిమ్మల్ని సరైన పాత్రతో సరిపోల్చుతాము.',
                cta: '✍️ శీఘ్ర నమోదు'
            },
            testimonials: {
                heading: '💬 మా సంఘం ఏమంటుంది',
                items: [
                    { name: 'దివ్య ఆర్.', city: 'బెంగళూరు', role: 'స్వయంసేవక రక్షకుడు', quote: 'PawSafeని ఉపయోగించి 20 నిమిషాల్లో నా మొదటి గాయపడిన కుక్కను రక్షించాను. దశలవారీ మార్గదర్శకత్వం దానిని చాలా సులభం చేసింది.' },
                    { name: 'కరణ్ ఎమ్.', city: 'ముంబై', role: 'నెలవారీ దాత', quote: 'ప్రతి కొద్ది రోజులకు బ్రూనో రికవరీ ట్రాకర్ అప్‌డేట్‌ను చూడటం ఉత్తమ అనుభూతి. ప్రతి రూపాయికి తగిన విలువ.' },
                    { name: 'సునీత పి.', city: 'చెన్నై', role: 'ఫీల్డ్ రిపోర్టర్', quote: 'నా కార్యాలయం సమీపంలో పాము కాటుకు గురైన కేసును నేను నివేదించాను. రెస్క్యూ టీమ్ 15 నిమిషాల్లో వచ్చింది. అద్భుతమైన వేదిక!' }
                ]
            },
            skills: {
                transport: { label: '🚗 రవాణా చేయగలను', desc: 'జంతువులను తరలించడానికి వాహనం ఉంది' },
                firstaid: { label: '🩺 ప్రథమ చికిత్స', desc: 'ప్రాథమిక జంతు ప్రథమ చికిత్స తెలుసు' },
                foster: { label: '🏠 ఆశ్రయం ఇవ్వగలను', desc: 'తాత్కాలికంగా జంతువుకు ఆశ్రయం ఇవ్వగలను' },
                document: { label: '📸 డాక్యుమెంట్ చేయగలను', desc: 'ఘటనా స్థలంలో ఫోటో/వీడియో ఆధారాలు' },
                vet: { label: '👨‍⚕️ వెట్ / పారా-వెట్', desc: 'వైద్య నేపథ్యం' },
                fundraise: { label: '💰 నిధుల సేకరణ', desc: 'అవగాహన కల్పించడం & నిధులు సేకరించడం' }
            },
            availability: ['వారాంతాల్లో మాత్రమే', 'వారపు రోజుల సాయంత్రం', 'ఎప్పుడైనా', 'ఆన్-కాల్ అత్యవసర పరిస్థితులు మాత్రమే'],
            form: {
                heading: '🐾 PawSafeలో చేరండి',
                subtext: 'శీఘ్ర 60-సెకన్ల సైన్-అప్. అనుభవం అవసరం లేదు.',
                name: 'పూర్తి పేరు *',
                city: 'నగరం *',
                phone: 'ఫోన్ నంబర్ *',
                availLabel: 'లభ్యత',
                skillsLabel: 'మీరు ఏమి చేయగలరు? (వర్తించే అన్నిటినీ ఎంచుకోండి)',
                submit: '🐾 ఇప్పుడే నమోదు చేసుకోండి — ఇది ఉచితం',
                success: {
                    title: 'PawSafe కుటుంబానికి స్వాగతం!',
                    msg: 'హలో {name}! మీ నమోదు ధృవీకరించబడింది. మీ దగ్గర రెస్క్యూ ఉన్నప్పుడు మేము {city}లో మిమ్మల్ని సంప్రదిస్తాము.',
                    note: '📱 ప్రత్యక్ష హెచ్చరికలను పొందడానికి మా యాప్‌ను (త్వరలో వస్తుంది)ダウンロード చేసుకోండి.',
                    done: 'పూర్తయింది'
                }
            }
        }
    },

    // ─────────────── বাংলা ───────────────
    bn: {
        nav: { home: 'হোম', about: 'আমাদের সম্পর্কে', contact: 'যোগাযোগ' },
        header: {
            login: '🔑 লগইন',
            volunteer: '🤝 স্বেচ্ছাসেবক',
            emergency: '🚨 জরুরি',
            groups: {
                rescue: '🐾 উদ্ধার',
                community: '🤝 সম্প্রদায়',
                info: 'ℹ️ তথ্য',
            }
        },
        hero: {
            title: 'পশু জরুরি উদ্ধার',
            brandLine: 'এর সাথে',
            subtitle: 'তাৎক্ষণিকভাবে পশু জরুরি পরিস্থিতি রিপোর্ট করুন। আপনার এলাকায় উদ্ধারকারীদের সাথে যোগাযোগ করুন। একসাথে জীবন বাঁচান।',
            report: 'জরুরি রিপোর্ট করুন',
            learnMore: 'আরও জানুন',
            trustedBy: '১০,০০০+ পোষ্য মালিকদের দ্বারা বিশ্বস্ত',
        },
        features: {
            heading: 'PawSafe কেন বেছে নেবেন',
            subtitle: 'পশুর জীবন বাঁচাতে ডিজাইন করা শক্তিশালী বৈশিষ্ট্য',
            items: [
                { icon: '📍', title: 'রিয়েল-টাইম লোকেশন', description: 'দ্রুত উদ্ধারের জন্য সঠিক GPS স্থানাঙ্ক শেয়ার করুন' },
                { icon: '📸', title: 'ছবির প্রমাণ', description: 'পশু শনাক্ত করতে উদ্ধারকারীদের জন্য ছবি তুলুন' },
                { icon: '👥', title: 'কমিউনিটি নেটওয়ার্ক', description: 'পেশাদার উদ্ধারকারী এবং স্বেচ্ছাসেবকদের সাথে সংযুক্ত হন' },
                { icon: '⏱️', title: 'দ্রুত প্রতিক্রিয়া', description: 'তাৎক্ষণিক পদক্ষেপের জন্য 24/7 জরুরি সতর্কতা সিস্টেম' },
                { icon: '📱', title: 'মোবাইল ফার্স্ট', description: 'দ্রুত রিপোর্টিংয়ের জন্য ব্যবহারে সহজ অ্যাপ' },
                { icon: '📊', title: 'কেস ট্র্যাকিং', description: 'উদ্ধার পরিস্থিতি অনুসরণ করুন এবং পশুর সুস্থতা ট্র্যাক করুন' },
            ],
        },
        howItWorks: {
            heading: 'এটি কীভাবে কাজ করে',
            subtitle: 'জীবন বাঁচানোর সহজ পদক্ষেপ',
            steps: [
                { number: '1', title: 'রিপোর্ট করুন', description: 'জরুরি বোতামে ট্যাপ করুন এবং বিপদে পড়া পশুর সম্পর্কে বিবরণ শেয়ার করুন' },
                { number: '2', title: 'লোকেশন শেয়ার করুন', description: 'উদ্ধারকারীদের পশু খুঁজে পেতে সাহায্য করতে GPS এবং ছবি দিন' },
                { number: '3', title: 'নেটওয়ার্ককে সতর্ক করুন', description: 'আপনার রিপোর্ট তাৎক্ষণিকভাবে কাছের উদ্ধার পেশাদারদের কাছে পাঠানো হয়' },
                { number: '4', title: 'উদ্ধার', description: 'প্রশিক্ষিত উদ্ধারকারীরা পশুকে বাঁচাতে দ্রুত সাড়া দেয়' },
            ],
            cta: { title: 'সাহায্য করতে প্রস্তুত?', subtitle: 'প্রতিদিন পার্থক্য তৈরি করা হাজার হাজার পশুপ্রেমীর সাথে যোগ দিন', button: 'এখনই শুরু করুন' },
        },
        about: {
            heading: 'PawSafe সম্পর্কে',
            p1: 'PawSafe হলো একটি কমিউনিটি-চালিত জরুরি প্রতিক্রিয়া প্ল্যাটফর্ম যা বিপদে পড়া পশুদের উদ্ধারে নিবেদিত।',
            mission: 'আমাদের লক্ষ্য',
            p2: 'প্রতিটি পশু নিরাপত্তা ও যত্নের যোগ্য। যখন একটি পশু বিপদে থাকে, সময় অত্যন্ত গুরুত্বপূর্ণ।',
            difference: 'আমরা কীভাবে পার্থক্য করি',
            list: [
                '📍 দ্রুত প্রতিক্রিয়ার জন্য রিয়েল-টাইম লোকেশন শেয়ারিং',
                '👥 পশুপ্রেমী এবং পেশাদারদের কমিউনিটি নেটওয়ার্ক',
                '📱 ব্যবহারে সহজ মোবাইল-ফার্স্ট প্ল্যাটফর্ম',
                '🚨 তাৎক্ষণিক পদক্ষেপের জন্য জরুরি সতর্কতা সিস্টেম',
                '📊 ট্র্যাকিং এবং ফলো-আপ যত্ন সমন্বয়',
            ],
        },
        contact: {
            heading: 'যোগাযোগ করুন',
            form: { title: 'আমাদের বার্তা পাঠান', name: 'আপনার নাম', email: 'আপনার ইমেইল', message: 'আপনার বার্তা', send: 'বার্তা পাঠান', success: 'আপনার বার্তার জন্য ধন্যবাদ!' },
            info: { title: 'যোগাযোগ তথ্য', email: '📧 ইমেইল', phone: '📱 ফোন', address: '🏢 ঠিকানা', addressLine: '123 অ্যানিমাল রেসকিউ অ্যাভেনিউ', hours: '⏰ সময়', hoursValue: '24/7 জরুরি সহায়তা' },
        },
        footer: {
            tagline: 'জরুরি পরিস্থিতিতে পশুর জীবন বাঁচাতে সম্প্রদায়গুলিকে সংযুক্ত করছে।',
            quickLinks: 'দ্রুত লিঙ্ক',
            links: { home: 'হোম', about: 'আমাদের সম্পর্কে', contact: 'যোগাযোগ', faq: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন', admin: 'অ্যাডমিন পোর্টাল' },
            resources: 'সম্পদ',
            resourceLinks: { partners: 'উদ্ধার অংশীদার', care: 'পশু যত্নের টিপস', safety: 'নিরাপত্তা গাইড', blog: 'ব্লগ' },
            legal: 'আইনি',
            legalLinks: { privacy: 'গোপনীয়তা নীতি', terms: 'সেবার শর্তাবলী', disclaimer: 'দায়বর্জন' },
            copyright: '© 2026 PawSafe. সমস্ত অধিকার সংরক্ষিত। 🐾',
            hotline: 'জরুরি হটলাইন',
            hotlineValue: '+919040959368',
            available: '24/7 উপলব্ধ',
        },
        donate: {
            tag: 'প্রাণীদের সাহায্য করুন',
            heading: 'আজই পার্থক্য আনুন',
            subtitle: 'আপনার দান সরাসরি প্রাণীদের খাদ্য, চিকিৎসা ও আশ্রয় দেয়',
            tabOneTime: 'এককালীন দান',
            tabMonthly: 'মাসিক সদস্যতা',
            chooseCause: 'কারণ বেছে নিন',
            chooseAmount: 'পরিমাণ বেছে নিন',
            customPlaceholder: 'যেকোনো পরিমাণ (সর্বনিম্ন ₹1)',
            choosePlan: 'পরিকল্পনা বেছে নিন',
            causes: { food: 'প্রাণীর খাবার', medical: 'চিকিৎসা', shelter: 'আশ্রয়', general: 'সাধারণ তহবিল' },
            donateNow: 'দান করুন',
            subscribe: 'সদস্য হন',
            month: 'মাস',
            popular: '⭐ সবচেয়ে জনপ্রিয়',
            subNote: 'যেকোনো সময় বাতিল করুন। কোনো লুকানো চার্জ নেই।',
            plans: {
                basic: { name: 'বেসিক কেয়ার', perks: ['দিনে ২টি প্রাণীকে খাবার', 'মাসিক রিপোর্ট', 'দাতা সনদ'] },
                care: { name: 'অ্যানিমাল কেয়ার', perks: ['দিনে ৬টি প্রাণীকে খাবার', 'পশু চিকিৎসা তহবিল', 'অগ্রাধিকার আপডেট', 'ডিজিটাল ব্যাজ'] },
                guardian: { name: 'গার্ডিয়ান', perks: ['দিনে ১৫টি প্রাণীকে খাবার', 'উদ্ধার পৃষ্ঠপোষকতা', 'দাতার দেওয়ালে নাম', 'কর রসিদ'] },
            },
            impact: { food: 'একদিন একটি পথ কুকুরকে খাওয়ায়', medical: 'প্রাথমিক পশু চিকিৎসা', shelter: 'এক সপ্তাহ আশ্রয়', care: 'মাসিক সম্পূর্ণ যত্ন' },
            thankyouHeading: 'অনেক ধন্যবাদ! 🐾',
            thankyouOneTime: '{cause}-এর জন্য {amount} দান জীবন বাঁচাবে!',
            thankyouSub: 'আপনি {plan} সদস্য হয়েছেন!',
            thankyouNote: 'নিশ্চিতকরণ আপনার ইমেইলে পাঠানো হয়েছে।',
            thankyouClose: 'বন্ধ করুন',
        },
        ngo: {
            tag: 'উদ্ধার কেন্দ্র খুঁজুন',
            heading: 'কাছের NGO ও উদ্ধার কেন্দ্র',
            subtitle: 'আপনার কাছে যাচাইকৃত পশু উদ্ধার সংস্থা',
            filterCity: 'শহর',
            filter247: 'শুধু 24/7',
            filterAmbulance: 'যানবাহন',
            filterWildlife: 'বন্যপ্রাণী',
            found: 'কেন্দ্র পাওয়া গেছে',
            reviews: 'মতামত',
            callNow: 'এখনই ফোন করুন',
            noResults: 'আপনার ফিল্টারে কোনো কেন্দ্র নেই।',
            staffPortal: '🔐 স্টাফ পোর্টাল',
        },
        support: {
            tag: 'উদ্ধারে সহায়তা',
            heading: 'প্রাণীদের আপনার সাহায্য দরকার',
            subtitle: 'প্রতিটি দান একটি জীবন বাঁচায়',
            required: '₹ প্রয়োজন',
            raised: '₹ সংগ্রহ',
            funded: 'তহবিল',
            toGo: 'বাকি',
            donateNow: 'এখন দান করুন',
            donateFor: 'দান করুন',
            customAmount: 'পরিমাণ লিখুন (₹)',
            thankYou: 'দানের জন্য ধন্যবাদ ₹',
            for: 'এর জন্য',
            critical: '🔴 সংকটজনক',
            urgent: '🟠 জরুরি',
            moderate: '🟢 স্থিতিশীল',
        },
        stats: {
            live: 'লাইভ',
            heading: 'লাইভ রেসকিউ কাউন্টার',
            subtitle: 'আমাদের নেটওয়ার্কে রিয়েল-টাইম প্রভাব',
            rescued: 'আজ উদ্ধার করা পশু',
            active: 'সক্রিয় উদ্ধার অনুরোধ',
            ngos: 'যাচাইকৃত NGO',
            volunteers: 'সক্রিয় স্বেচ্ছাসেবক',
        },
        fab: { label: 'জরুরি' },
        readyToHelp: {
            tag: '🤝 যুক্ত হোন',
            heading: 'সাহায্য করতে প্রস্তুত? 🐾',
            subtitle: 'প্রাণীদের রক্ষাকারী ১২,৪০০+ ভারতীয়দের সাথে যোগ দিন — একজন উদ্ধারকারী, দাতা বা ফিল্ড রিপোর্টার হিসেবে',
            stats: {
                volunteers: 'স্বেচ্ছাসেবক',
                rescues: 'উদ্ধার',
                partners: 'NGO অংশীদার',
                states: 'রাজ্য'
            },
            roles: [
                {
                    title: 'স্বেচ্ছাসেবক উদ্ধারকারী',
                    desc: 'কাছের জরুরি কেসগুলি গ্রহণ করুন, আহত প্রাণীদের পরিবহনে সহায়তা করুন এবং মাঠে NGO-দের সাহায্য করুন।',
                    perks: ['রিয়েল-টাইম উদ্ধার সতর্কতা পান', 'জরুরি স্থানে নেভিগেট করুন', 'আপনার সাহায্য করা প্রাণীদের ট্র্যাক করুন'],
                    cta: 'স্বেচ্ছাসেবক হিসেবে যোগ দিন'
                },
                {
                    title: 'দাতা',
                    desc: 'সারা ভারতে উদ্ধার করা প্রাণীদের খাবার, চিকিৎসা, আশ্রয় এবং জরুরি যত্নের জন্য অর্থ সাহায্য করুন।',
                    perks: ['এককালীন বা মাসিক বিকল্প', 'আপনার কারণ বেছে নিন', 'প্রভাব রিপোর্ট পান'],
                    cta: 'দান শুরু করুন'
                },
                {
                    title: 'ফিল্ড রিপোর্টার',
                    desc: 'রাস্তায় আহত বা বিপদে পড়া প্রাণী দেখেছেন? অবিলম্বে তাদের রিপোর্ট করুন যাতে উদ্ধারকারী দল প্রতিক্রিয়া জানাতে পারে।',
                    perks: ['৬০ সেকেন্ডে রিপোর্ট জমা দিন', 'লাইভ লোকেশন এবং ছবি শেয়ার করুন', 'স্ট্যাটাস আপডেট পান'],
                    cta: 'জরুরি রিপোর্ট করুন'
                }
            ],
            banner: {
                title: 'কোথা থেকে শুরু করবেন বুঝতে পারছেন না?',
                desc: '৬০ সেকেন্ডে নিবন্ধন করুন — আমরা আপনার দক্ষতা এবং উপলব্ধতার ভিত্তিতে আপনাকে সঠিক ভূমিকার সাথে মিলিয়ে দেব।',
                cta: '✍️ দ্রুত নিবন্ধন'
            },
            testimonials: {
                heading: '💬 আমাদের সম্প্রদায় কি বলছে',
                items: [
                    { name: 'দিব্যা আর.', city: 'বেঙ্গালুরু', role: 'স্বেচ্ছাসেবক উদ্ধারকারী', quote: 'পা-সেফ ব্যবহার করে ২০ মিনিটে আমি আমার প্রথম আহত কুকুরটিকে উদ্ধার করেছি। ধাপে ধাপে নির্দেশিকা এটিকে খুব সহজ করে তুলেছে।' },
                    { name: 'করণ এম.', city: 'মুম্বাই', role: 'মাসিক দাতা', quote: 'প্রতি কয়েকদিন অন্তর ব্রুনোর রিকভারি ট্র্যাকার আপডেট দেখা সবচেয়ে ভালো অনুভূতি। প্রতিটি টাকা সার্থক।' },
                    { name: 'সুনীতা পি.', city: 'চেন্নাই', role: 'ফিল্ড রিপোর্টার', quote: 'আমি আমার অফিসের কাছে সাপে কামড়ানোর একটি ঘটনার রিপোর্ট করেছি। উদ্ধারকারী দল ১৫ মিনিটে চলে আসে। অসাধারণ প্ল্যাটফর্ম!' }
                ]
            },
            skills: {
                transport: { label: '🚗 পরিবহন করতে পারি', desc: 'প্রাণীদের সরানোর জন্য যানবাহন আছে' },
                firstaid: { label: '🩺 প্রাথমিক চিকিৎসা', desc: 'প্রাণীদের প্রাথমিক চিকিৎসা জানি' },
                foster: { label: '🏠 লালন-পালন করতে পারি', desc: 'অস্থায়ীভাবে প্রাণীকে আশ্রয় দিতে পারি' },
                document: { label: '📸 নথিবদ্ধ করতে পারি', desc: 'ঘটনাস্থলে ছবি/ভিডিও প্রমাণ' },
                vet: { label: '👨‍⚕️ ভেট / প্যারা-ভেট', desc: 'চিকিৎসা পটভূমি' },
                fundraise: { label: '💰 অর্থ সংগ্রহ', desc: 'সচেতনতা বৃদ্ধি এবং অর্থ সংগ্রহ' }
            },
            availability: ['শুধুমাত্র সপ্তাহান্তে', 'কাজের দিনের সন্ধ্যা', 'যে কোনো সময়', 'শুধুমাত্র অন-কল জরুরি অবস্থা'],
            form: {
                heading: '🐾 পা-সেফে যোগ দিন',
                subtext: 'মাত্র ৬০ সেকেন্ডে নিবন্ধন করুন। কোনো অভিজ্ঞতার প্রয়োজন নেই।',
                name: 'পুরো নাম *',
                city: 'শহর *',
                phone: 'ফোন নম্বর *',
                availLabel: 'উপলব্ধতা',
                skillsLabel: 'আপনি কি করতে পারেন? (প্রযোজ্য সবগুলি নির্বাচন করুন)',
                submit: '🐾 এখনই নিবন্ধন করুন — এটি বিনামূল্যে',
                success: {
                    title: 'পা-সেফ পরিবারে আপনাকে স্বাগতম!',
                    msg: 'হ্যালো {name}! আপনার নিবন্ধন নিশ্চিত করা হয়েছে। আপনার কাছাকাছি কোনো উদ্ধারকাজ থাকলে আমরা {city}-তে আপনার সাথে যোগাযোগ করব।',
                    note: '📱 লাইভ সতর্কতা পেতে আমাদের অ্যাপ (শীঘ্রই আসছে) ডাউনলোড করুন।',
                    done: 'সম্পন্ন'
                }
            }
        }
    },
};

export default translations;
