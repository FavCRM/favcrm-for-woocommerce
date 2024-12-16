import { useState, useEffect } from '@wordpress/element';

import FloatingButton from './components/FloatingButton';
import WelcomeScreen from './components/WelcomeScreen';
import RewardSchemeScreen from './components/RewardSchemeScreen';
import GiftOfferScreen from './components/GiftOfferScreen';
import MemberHomeScreen from './components/MemberHomeScreen';
import ActivityScreen from './components/ActivityScreen';
import MyRewardScreen from './components/MyRewardScreen';

export default function Block({ nonce, isUserLoggedOn }) {
  const [show, setShow] = useState(false)
  const [site, setSite] = useState(null)
  const [screen, setScreen] = useState('welcome')
  const [member, setMember] = useState(null)

  useEffect(() => {
    fetchSite();

    if (isUserLoggedOn) {
      fetchMember();
    }
  }, [])

  const fetchSite = async () => {
    const response = await fetch(
      '/wp-json/fav/v1/site', {
        headers: {
          'X-WP-Nonce': nonce
        }
      }
    );
    const data = await response.json();

    setSite(data);
  }

  const fetchMember = async () => {
    const response = await fetch(
      '/wp-json/fav/v1/my-member-profile', {
        headers: {
          'X-WP-Nonce': nonce
        }
      }
    );
    const data = await response.json();

    setMember(data);
  }

  const renderScreen = () => {
    switch(screen) {
      case 'my-reward':
        return <MyRewardScreen site={site} setShow={setShow} setScreen={setScreen} member={member} />;
      case 'gift-offer':
        return <GiftOfferScreen site={site} setShow={setShow} setScreen={setScreen} member={member} />;
      case 'reward-scheme':
        return <RewardSchemeScreen site={site} setShow={setShow} setScreen={setScreen} />;
      case 'activity':
        return <ActivityScreen site={site} setShow={setShow} setScreen={setScreen} />;
      case 'welcome':
      default:
        return isUserLoggedOn
          ? <MemberHomeScreen site={site} setShow={setShow} setScreen={setScreen} member={member} />
          : <WelcomeScreen site={site} setShow={setShow} setScreen={setScreen} />;
    }
  }

  if (!site) {
    return null
  }

  return (
    <>
      <FloatingButton show={show} setShow={setShow} />
      {
        show && (
          <div
            className="fixed z-[100] left-0 bottom-0 right-0 top-auto sm:!left-8 sm:!bottom-24 sm:right-auto sm:top-auto bg-[#f6fbff] sm:!rounded-2xl h-full w-full sm:!h-[calc(100vh_-_300px)] sm:!w-[350px] overflow-y-auto"
          >
            {renderScreen()}
          </div>
        )
      }
    </>
  )
}
