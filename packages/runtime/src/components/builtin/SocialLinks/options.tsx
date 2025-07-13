import { LogoAngellist20 } from '../../icons/LogoAngellist20'
import { LogoCodepen20 } from '../../icons/LogoCodepen20'
import { LogoDiscord20 } from '../../icons/LogoDiscord20'
import { LogoDribbble20 } from '../../icons/LogoDribbble20'
import { LogoFacebook20 } from '../../icons/LogoFacebook20'
import { LogoGithub20 } from '../../icons/LogoGithub20'
import { LogoInstagram20 } from '../../icons/LogoInstagram20'
import { LogoLinkedin20 } from '../../icons/LogoLinkedin20'
import { LogoMedium20 } from '../../icons/LogoMedium20'
import { LogoPinterest20 } from '../../icons/LogoPinterest20'
import { LogoReddit20 } from '../../icons/LogoReddit20'
import { LogoRss20 } from '../../icons/LogoRss20'
import { LogoSlack20 } from '../../icons/LogoSlack20'
import { LogoSnapchat20 } from '../../icons/LogoSnapchat20'
import { LogoSoundcloud20 } from '../../icons/LogoSoundcloud20'
import { LogoSpotify20 } from '../../icons/LogoSpotify20'
import { LogoTelegram20 } from '../../icons/LogoTelegram20'
import { LogoTumblr20 } from '../../icons/LogoTumblr20'
import { LogoTwitch20 } from '../../icons/LogoTwitch20'
import { LogoTwitter20 } from '../../icons/LogoTwitter20'
import { LogoWhatsapp20 } from '../../icons/LogoWhatsapp20'
import { LogoVimeo20 } from '../../icons/LogoVimeo20'
import { LogoX20 } from '../../icons/LogoX20'
import { LogoYelp20 } from '../../icons/LogoYelp20'
import { LogoYoutube20 } from '../../icons/LogoYoutube20'

export const SocialLinksOptions = [
  { type: 'angellist', label: 'AngelList', icon: <LogoAngellist20 />, brandColor: 'black' },
  { type: 'codepen', label: 'CodePen', icon: <LogoCodepen20 />, brandColor: 'black' },
  { type: 'discord', label: 'Discord', icon: <LogoDiscord20 />, brandColor: '#5865F2' },
  { type: 'dribbble', label: 'Dribbble', icon: <LogoDribbble20 />, brandColor: '#ea4c89' },
  { type: 'facebook', label: 'Facebook', icon: <LogoFacebook20 />, brandColor: '#3b5998' },
  { type: 'github', label: 'GitHub', icon: <LogoGithub20 />, brandColor: 'black' },
  { type: 'instagram', label: 'Instagram', icon: <LogoInstagram20 />, brandColor: 'black' },
  { type: 'linkedin', label: 'LinkedIn', icon: <LogoLinkedin20 />, brandColor: '#0077b5' },
  { type: 'medium', label: 'Medium', icon: <LogoMedium20 />, brandColor: 'black' },
  { type: 'pinterest', label: 'Pinterest', icon: <LogoPinterest20 />, brandColor: '#bd081c' },
  { type: 'reddit', label: 'Reddit', icon: <LogoReddit20 />, brandColor: '#ff4500' },
  { type: 'rss', label: 'RSS', icon: <LogoRss20 />, brandColor: 'black' },
  { type: 'slack', label: 'Slack', icon: <LogoSlack20 />, brandColor: '#fffc00' },
  { type: 'snapchat', label: 'Snapchat', icon: <LogoSnapchat20 />, brandColor: '#fffc00' },
  { type: 'soundcloud', label: 'SoundCloud', icon: <LogoSoundcloud20 />, brandColor: '#ff3300' },
  { type: 'spotify', label: 'Spotify', icon: <LogoSpotify20 />, brandColor: '#1db954' },
  { type: 'telegram', label: 'Telegram', icon: <LogoTelegram20 />, brandColor: '#0088cc' },
  { type: 'tumblr', label: 'Tumblr', icon: <LogoTumblr20 />, brandColor: '#35465c' },
  { type: 'twitch', label: 'Twitch', icon: <LogoTwitch20 />, brandColor: '#6441A4' },
  { type: 'twitter', label: 'Twitter', icon: <LogoTwitter20 />, brandColor: '#1da1f2' },
  { type: 'whatsapp', label: 'WhatsApp', icon: <LogoWhatsapp20 />, brandColor: '#25d366' },
  { type: 'vimeo', label: 'Vimeo', icon: <LogoVimeo20 />, brandColor: '#1ab7ea' },
  { type: 'x', label: 'X', icon: <LogoX20 />, brandColor: 'black' },
  { type: 'yelp', label: 'Yelp', icon: <LogoYelp20 />, brandColor: '#af0606' },
  { type: 'youtube', label: 'YouTube', icon: <LogoYoutube20 />, brandColor: '#ff0000' },
] as const

export type SocialLinksOptionType = (typeof SocialLinksOptions)[number]['type']
