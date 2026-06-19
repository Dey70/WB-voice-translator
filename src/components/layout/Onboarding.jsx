import { ArrowRight, Languages, MapPinned, ShieldCheck } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

export default function Onboarding() {
  const completeOnboarding = useAppStore((state) => state.completeOnboarding)

  return (
    <section className="onboarding" aria-label="Welcome to KothaSetu">
      <div className="onboarding-shade" />
      <div className="onboarding-content">
        <span className="postcard-stamp">Made for Bengal journeys</span>
        <div className="onboarding-mark">ক</div>
        <p className="onboarding-script">কথাসেতু</p>
        <h1>Speak words.<br />Build bridges.</h1>
        <p>Translate, travel and understand West Bengal with confidence, even when the signal fades.</p>
        <div className="onboarding-features">
          <span><Languages size={17} /> Four languages</span>
          <span><MapPinned size={17} /> Local discovery</span>
          <span><ShieldCheck size={17} /> Offline essentials</span>
        </div>
        <button onClick={completeOnboarding}>Enter KothaSetu <ArrowRight size={18} /></button>
      </div>
    </section>
  )
}
