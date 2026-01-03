import { AlertCircle, BarChart3, FileText, Activity, ArrowRight, Brain } from 'lucide-react';

interface FeaturesProps {
  scrollY: number;
}

export default function Features({ scrollY }: FeaturesProps) {
  const features = [
    {
      icon: AlertCircle,
      title: 'Health Emergency',
      description: 'Instant access to emergency protocols, first aid guides, and emergency contact integration.',
      color: 'from-red-500 to-rose-400',
      shadowColor: 'shadow-red-300/50',
      badge: 'Emergency',
      badgeColor: 'bg-red-100 text-red-600',
      href: 'https://devjay-healthcare.netlify.app/first-aid',
    },
    {
      icon: BarChart3,
      title: 'Health Analytics',
      description: 'Advanced analytics and insights from your health data with predictive AI modeling.',
      color: 'from-orange-500 to-amber-400',
      shadowColor: 'shadow-orange-300/50',
      badge: 'AI Insights',
      badgeColor: 'bg-orange-100 text-orange-600',
      href: '#',
    },
    {
      icon: FileText,
      title: 'Health Records',
      description: 'Comprehensive health records and AI search history securely stored on blockchain.',
      color: 'from-emerald-500 to-teal-400',
      shadowColor: 'shadow-emerald-300/50',
      badge: 'Secure & Private',
      badgeColor: 'bg-emerald-100 text-emerald-600',
      href: 'https://devjay-healthcare.netlify.app/history',
    },
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Live health monitoring dashboard with IoT device integration and real-time vital signs tracking.',
      color: 'from-blue-500 to-cyan-400',
      shadowColor: 'shadow-blue-300/50',
      badge: 'Live IoT Data',
      badgeColor: 'bg-blue-100 text-blue-600',
      href: 'https://devjay-healthcare.netlify.app/monitoring',
    },
  ];

  return (
    <section id="features" className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Comprehensive Health Solutions
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">
            Four powerful tools to transform your healthcare experience and keep you in control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const scrollOffset = 600 + index * 100;
            const cardOpacity = Math.min(Math.max((scrollY - scrollOffset) / 200 + 1, 0), 1);
            const cardTranslateY = Math.max(50 - (scrollY - scrollOffset) / 5, 0);

            return (
              <div
                key={feature.title}
                className="group backdrop-blur-xl bg-white/50 border border-white/60 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${cardTranslateY}px)`,
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 2px 0 rgba(255, 255, 255, 0.8)',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg ${feature.shadowColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${feature.badgeColor}`}
                  >
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4 font-light">
                  {feature.description}
                </p>

                <button
                  onClick={() => feature.href !== '#' && (window.location.href = feature.href)}
                  className="flex items-center space-x-2 text-blue-600 font-semibold group-hover:space-x-3 transition-all duration-300"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-cyan-400/10 border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Ready to Transform Your Healthcare?
          </h3>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto font-light">
            Join thousands of users who trust HealthChain for secure, AI-powered health management
          </p>
          <button
            onClick={() => window.location.href = 'https://www.jotform.com/app/253583637449470'}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full font-semibold shadow-2xl shadow-blue-300/50 hover:shadow-blue-400/60 transition-all duration-300 hover:scale-105">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}
