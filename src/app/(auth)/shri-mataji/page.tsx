import Image from 'next/image';
import { getRequestLocale } from '@/lib/serverLocale';

const content = {
  en: {
    eyebrow: 'The Founder',
    title: 'Shri Mataji Nirmala Devi',
    sections: {
      founderTitle: 'Founder of Sahaja Yoga',
      founder: [
        'Shri Mataji discovered a unique method of meditation called Sahaja Yoga that enables inner enlightenment and reveals the true potential of humanity. She devoted her entire life to sharing this experience, and today hundreds of thousands of people around the world practice Sahaja Yoga.',
        'She taught that a motherly spiritual energy, Kundalini, exists within every person. When awakened, it leads to a state of spontaneous meditation and deep inner peace.',
      ],
      masterTitle: 'The great master of yoga',
      master:
        'Shri Mataji showed that a motherly spiritual energy called Kundalini exists within each person, and that its awakening leads to spontaneous meditation. She was able to awaken this energy in thousands of people, which distinguishes Sahaja Yoga from other methods and helps reveal our best qualities.',
      humanityTitle: 'A life dedicated to humanity',
      humanity: [
        'Shri Mataji founded and supported many non-profit initiatives: centers for destitute women and orphans, international schools with a balanced curriculum, health centers applying Sahaja Yoga, and academies teaching classical arts.',
        'Her vision was always to offer inner transformation freely, without dogma, so each person could discover what is beneficial for their own spiritual development.',
      ],
      lifeTitle: 'Life among great people',
      life: [
        'Shri Mataji was raised among scholars and political activists involved in India’s liberation movement, and Mahatma Gandhi recognized her exceptional spiritual potential.',
        'Her husband, Sir C. P. Srivastava, rose through public service to become Private Secretary to India’s Prime Minister and later served as Secretary-General of the International Maritime Organization.',
      ],
      earlyTitle: 'Early years',
      early: [
        'Shri Mataji was born as Nirmala Salve on March 21, 1923, in Chindwara, India. Her family descended from the Shalivahana dynasty. Her parents were deeply involved in India’s independence movement.',
        'Her father was a lawyer and scientist, fluent in many languages and known for translating the Qur’an into Hindi. Her mother was the first woman in India to receive an honors degree in mathematics.',
        'As a teenager she participated in the liberation movement and was detained by British soldiers. In 1947, she married Chandrika Prasad Srivastava, later known as Sir C. P. Srivastava, and they had two daughters.',
      ],
      foundingTitle: 'The founding of Sahaja Yoga',
      founding: [
        'Shri Mataji sought a way to help people reach a higher awareness of themselves. After deep contemplation, she experienced the awakening of her Kundalini and the opening of the Sahasrara in May 1970. She then discovered the method of meditation she later named Sahaja Yoga, meaning spontaneous union.',
        'She began teaching this method to a few individuals, awakening their Kundalinis and giving them Self-Realisation. Over time, thousands experienced inner freedom and a cool breeze on their palms and above the head.',
      ],
      sharingTitle: 'Sharing the experience',
      sharing:
        'After moving to London, Shri Mataji taught Sahaja Yoga publicly, offered lectures and interviews, and gave individual attention to seekers. She never charged for Self-Realisation, insisting it is the birthright of every person.',
      visionTitle: 'A global vision',
      vision:
        'From the 1980s onward she travelled across Europe, North America, Australia, South America, Asia, and the Pacific region, sharing Sahaja Yoga with people of all backgrounds.',
      educationTitle: 'Education and the arts',
      education: [
        'Shri Mataji emphasized education grounded in moral and spiritual growth. She created schools based on Sahaja Yoga and highlighted the value of discipline based on love and respect.',
        'In the arts, she supported Indian classical traditions and helped establish an Academy of Arts in Maharashtra. Students from many countries study music, dance, and painting there, and she also supported humanitarian projects such as the Nirmala Prem Center for orphans.',
      ],
      healthTitle: 'A holistic approach to health',
      health: [
        'Shri Mataji studied how meditation affects the subtle energy system of chakras and channels and how balance can be restored through Kundalini awakening. She emphasized that while Sahaja Yoga may improve health, its goal is spiritual awakening.',
        'Clinical studies and wellness work inspired by Sahaja Yoga have reported positive effects for conditions such as hypertension, asthma, and attention difficulties.',
      ],
      creativityTitle: 'Pure creativity',
      creativity:
        'Shri Mataji saw art as a means of self-expression and a way to preserve world cultures. She supported artists and helped create spaces where classical traditions could flourish.',
      quote: 'They must take care of this world.',
    },
  },
  te: {
    eyebrow: 'స్థాపకురాలు',
    title: 'శ్రీ మాతాజీ నిర్మలా దేవి',
    sections: {
      founderTitle: 'సహజ యోగ స్థాపకురాలు',
      founder: [
        'శ్రీ మాతాజీ సహజ యోగ అనే ప్రత్యేక ధ్యాన పద్ధతిని కనుగొన్నారు. ఇది అంతరజ్యోతిని మేల్కొలిపి మానవత్వంలోని నిజమైన సామర్థ్యాన్ని వెలికి తీయగలదు. ఆమె తన జీవితమంతా ఈ అనుభవాన్ని పంచుకునేందుకు అంకితం చేశారు.',
        'ప్రతి మనిషిలోనూ తల్లితనమయిన ఆధ్యాత్మిక శక్తి కుండలిని ఉందని ఆమె బోధించారు. అది మేల్కొన్నప్పుడు సహజ ధ్యాన స్థితి మరియు లోతైన అంతరశాంతి కలుగుతుంది.',
      ],
      masterTitle: 'యోగ మహాగురు',
      master:
        'కుండలిని అనే తల్లితనమయిన ఆధ్యాత్మిక శక్తి ప్రతి మనిషిలోనూ ఉందని, దాని మేల్కొలుపు సహజ ధ్యానానికి దారితీస్తుందని శ్రీ మాతాజీ చూపించారు. వేలాది మందిలో ఈ శక్తిని మేల్కొలిపిన ఆమె సహజ యోగ ప్రత్యేకతను స్థాపించారు.',
      humanityTitle: 'మానవత్వానికి అంకితమైన జీవితం',
      humanity: [
        'శ్రీ మాతాజీ అనేక సేవా కార్యక్రమాలను స్థాపించి మద్దతు ఇచ్చారు: ఆపన్న మహిళలు, అనాథల కోసం కేంద్రాలు, సమతుల విద్యా విధానంతో పాఠశాలలు, సహజ యోగ ఆధారిత ఆరోగ్య కేంద్రాలు, శాస్త్రీయ కళల అకాడమీలు.',
        'ఆమె దృష్టి ఎల్లప్పుడూ ఒకటే: మతాచారం లేకుండా, స్వేచ్ఛగా అంతర్మార్పును అందించడం.',
      ],
      lifeTitle: 'మహనీయుల మధ్య జీవితం',
      life: [
        'భారత స్వాతంత్ర్యోద్యమంతో అనుబంధం ఉన్న పండితులు, సామాజిక కార్యకర్తల మధ్య ఆమె పెరిగారు; మహాత్మా గాంధీ ఆమె ఆధ్యాత్మిక సామర్థ్యాన్ని గుర్తించారు.',
        'ఆమె భర్త సర్ సి. పి. శ్రీవాస్తవ ప్రజాసేవలో ఎదిగి భారత ప్రధానమంత్రికి ప్రైవేట్ సెక్రటరీగా, తరువాత అంతర్జాతీయ సముద్ర సంస్థ ప్రధాన కార్యదర్శిగా సేవలందించారు.',
      ],
      earlyTitle: 'ప్రారంభ సంవత్సరాలు',
      early: [
        '1923 మార్చి 21న చింద్వారాలో నిర్మల సాల్వేగా జన్మించిన శ్రీ మాతాజీ, స్వాతంత్ర్యోద్యమ స్ఫూర్తితో కూడిన కుటుంబంలో పెరిగారు.',
        'ఆమె తండ్రి పండితుడు, శాస్త్రవేత్త; తల్లి గణితంలో గౌరవ పట్టా పొందిన భారతదేశపు మొదటి మహిళల్లో ఒకరు.',
        'యువతలోనే ఆమె స్వాతంత్ర్యోద్యమంలో పాల్గొన్నారు. 1947లో చంద్రికా ప్రసాద్ శ్రీవాస్తవ గారిని వివాహం చేసుకున్నారు.',
      ],
      foundingTitle: 'సహజ యోగ ఆవిర్భావం',
      founding: [
        'మనిషి తన ఉన్నత అవగాహనను తెలుసుకోవడానికి మార్గం కనుగొనాలనే కాంక్షతో శ్రీ మాతాజీ ధ్యానించారు. 1970 మేలో సహస్రార విప్పు మరియు కుండలిని మేల్కొలుపు అనుభవం ద్వారా ఆమె సహజ యోగ పద్ధతిని ఆవిష్కరించారు.',
        'తర్వాత కొద్దిమందికి ఈ పద్ధతిని బోధించి వారి కుండలినిని మేల్కొలిపి స్వీయ సాక్షాత్కారం అందించారు. క్రమంగా వేలాదిమంది అంతర విముక్తిని అనుభవించారు.',
      ],
      sharingTitle: 'అనుభవాన్ని పంచుకోవడం',
      sharing:
        'లండన్‌కు వెళ్ళిన తర్వాత శ్రీ మాతాజీ సహజ యోగను బహిరంగంగా బోధించారు, ఉపన్యాసాలు ఇచ్చారు, అన్వేషకులకు వ్యక్తిగత మార్గదర్శకత్వం అందించారు. స్వీయ సాక్షాత్కారం ప్రతి మనిషి జన్మహక్కు అని చెబుతూ ఎప్పుడూ దానికి రుసుము తీసుకోలేదు.',
      visionTitle: 'ప్రపంచ దృష్టికోణం',
      vision:
        '1980ల నుండి ఆమె యూరప్, ఉత్తర అమెరికా, ఆస్ట్రేలియా, దక్షిణ అమెరికా, ఆసియా, పసిఫిక్ ప్రాంతాలలో విస్తృతంగా పర్యటిస్తూ అన్ని నేపథ్యాల ప్రజలకు సహజ యోగను అందించారు.',
      educationTitle: 'విద్య మరియు కళలు',
      education: [
        'నైతిక, ఆధ్యాత్మిక అభివృద్ధిపై ఆధారపడి ఉండే విద్యకు శ్రీ మాతాజీ ప్రాధాన్యం ఇచ్చారు. ప్రేమ, గౌరవం ఆధారిత క్రమశిక్షణను ఆమె ప్రోత్సహించారు.',
        'కళారంగంలో భారతీయ శాస్త్రీయ సంప్రదాయాలకు ఆమె మద్దతు ఇచ్చి మహారాష్ట్రలో కళల అకాడమీ స్థాపనకు తోడ్పడ్డారు.',
      ],
      healthTitle: 'ఆరోగ్యంపై సమగ్ర దృష్టి',
      health: [
        'ధ్యానం సూక్ష్మ నాడులు, చక్రాలపై చూపే ప్రభావాన్ని శ్రీ మాతాజీ లోతుగా పరిశీలించారు. కుండలిని మేల్కొలుపు ద్వారా సమతుల్యత సాధ్యమని ఆమె వివరించారు.',
        'సహజ యోగ ఆధారిత పరిశోధనలు రక్తపోటు, ఆస్తమా, ఏకాగ్రత సమస్యల వంటి పరిస్థితులపై సానుకూల ఫలితాలను సూచించాయి.',
      ],
      creativityTitle: 'శుద్ధ సృజనాత్మకత',
      creativity:
        'ప్రపంచ సంస్కృతులను సంరక్షించే సాధనంగా కళను శ్రీ మాతాజీ చూశారు. శాస్త్రీయ కళాసంప్రదాయాలు వికసించేందుకు ఆమె మద్దతు ఇచ్చారు.',
      quote: 'ఈ ప్రపంచాన్ని వారు సంరక్షించాలి.',
    },
  },
} as const;

export default function ShriMatajiPage() {
  const locale = getRequestLocale();
  const copy = content[locale].sections;

  return (
    <div className="bg-[color:var(--bg)] text-[color:var(--muted)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-14">
        <p className="text-sm uppercase tracking-[0.3em] text-center text-[color:var(--muted)]">{content[locale].eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-center text-[color:var(--ink)] mb-10">{content[locale].title}</h1>
        <section className="mb-16"><div className="flex flex-col md:flex-row items-center gap-10"><div className="md:w-1/2"><Image src="/maa-wide.jpg" alt="Shri Mataji Nirmala Devi" width={640} height={420} className="rounded-2xl shadow-soft" priority /></div><div className="md:w-1/2"><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.founderTitle}</h2>{copy.founder.map((p) => <p key={p} className="mb-4">{p}</p>)}</div></div></section>
        <section className="mb-16"><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4 text-center">{copy.masterTitle}</h2><p className="mb-4 text-center max-w-3xl mx-auto">{copy.master}</p><div className="mt-8 max-w-4xl mx-auto"><div className="rounded-2xl overflow-hidden border border-[color:var(--border)] shadow-soft bg-[color:var(--surface)]"><Image src="/maa-landscape.jpg" alt="Shri Mataji Nirmala Devi smiling" width={1200} height={700} className="w-full h-auto object-cover" /></div></div></section>
        <section className="mb-16 grid md:grid-cols-2 gap-10"><div><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.humanityTitle}</h2>{copy.humanity.map((p) => <p key={p} className="mb-4">{p}</p>)}</div><div><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.lifeTitle}</h2>{copy.life.map((p) => <p key={p} className="mb-4">{p}</p>)}</div></section>
        <section className="mb-16"><div className="grid md:grid-cols-2 gap-10 items-center"><div><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.earlyTitle}</h2>{copy.early.map((p) => <p key={p} className="mb-4">{p}</p>)}</div><div className="rounded-2xl overflow-hidden border border-[color:var(--border)] shadow-soft bg-[color:var(--surface)]"><Image src="/maa-wide2.jpg" alt="Shri Mataji Nirmala Devi" width={1200} height={700} className="w-full h-auto object-cover" /></div></div></section>
        <section className="mb-16"><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.foundingTitle}</h2>{copy.founding.map((p) => <p key={p} className="mb-4">{p}</p>)}</section>
        <section className="mb-16 grid md:grid-cols-2 gap-10"><div><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.sharingTitle}</h2><p className="mb-4">{copy.sharing}</p></div><div><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.visionTitle}</h2><p className="mb-4">{copy.vision}</p></div></section>
        <section className="mb-16"><div className="grid md:grid-cols-2 gap-10 items-center"><div><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.educationTitle}</h2>{copy.education.map((p) => <p key={p} className="mb-4">{p}</p>)}</div><div className="rounded-2xl overflow-hidden border border-[color:var(--border)] shadow-soft bg-[color:var(--surface)]"><Image src="/maa-landscape2.jpg" alt="Shri Mataji Nirmala Devi smiling" width={1200} height={700} className="w-full h-auto object-cover" /></div></div></section>
        <section className="mb-16"><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.healthTitle}</h2>{copy.health.map((p) => <p key={p} className="mb-4">{p}</p>)}</section>
        <section className="mb-16"><h2 className="text-2xl font-semibold text-[color:var(--ink)] mb-4">{copy.creativityTitle}</h2><p className="mb-4">{copy.creativity}</p></section>
        <section className="text-center"><blockquote className="italic text-[color:var(--muted)]">“{copy.quote}”</blockquote><p className="mt-2 text-sm text-[color:var(--muted)]">— Shri Mataji Nirmala Devi</p></section>
      </div>
    </div>
  );
}
