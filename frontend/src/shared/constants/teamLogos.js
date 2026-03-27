import cskLogo from '../../teams svg/ipl-chennai-super-kings-logo-png_seeklogo-196613.svg'
import miLogo from '../../teams svg/ipl-mumbai-indians-logo-png_seeklogo-173404.svg'
import rcbLogo from '../../teams svg/rcb-logo-png_seeklogo-531612.svg'
import kkrLogo from '../../teams svg/Kolkata-Knight-Riders-Logo.svg'
import rrLogo from '../../teams svg/ipl-rajasthan-royals-logo-png_seeklogo-237065.svg'
import srhLogo from '../../teams svg/sunrisers hyderabad.svg'
import dcLogo from '../../teams svg/delhi-capitals3041.svg'
import pbksLogo from '../../teams svg/ipl-kings-xi-punjab-logo-png_seeklogo-225011.svg'
import lsgLogo from '../../teams svg/lucknow-super-giants-logo-png_seeklogo-465449.svg'
import gtLogo from '../../teams svg/gujarat-titans-ipl-logo-png_seeklogo-431226.svg'

export const TEAM_LOGOS = {
  'Chennai Super Kings': cskLogo,
  'Mumbai Indians': miLogo,
  'Royal Challengers Bengaluru': rcbLogo,
  'Kolkata Knight Riders': kkrLogo,
  'Rajasthan Royals': rrLogo,
  'Sunrisers Hyderabad': srhLogo,
  'Delhi Capitals': dcLogo,
  'Punjab Kings': pbksLogo,
  'Lucknow Super Giants': lsgLogo,
  'Gujarat Titans': gtLogo,
}

export function getTeamLogo(teamName) {
  return TEAM_LOGOS[teamName] || null
}
