**Weather Data & Weather Display**

1.  Temperature High and Low values is the range across the next 24 hours - OpenWeatherMap API `/weather` endpoint does not provide daily temperature range values. To get a more accurate daily temperature range, I used the `/forecast` endpoint and took the highest and lowest temperature forecasted across the next eight 3-hour slots (24 hours total).
2.  Temperatures are in Celsius - A toggle was not specified in the assessment. If implemented in the future, I would use a dropdown menu or settings page for toggling between temperature units.
3.  `/forecast` call failing results in rendering the high and low temperature value as “--”.
4.  Timestamp uses the user's local timezone.
5.  Only two weather icons are used - The provided assets are a sun and a cloud, which cannot represent OpenWeatherMap's full condition set. The icon is selected by the day/night suffix on the API's icon code — sun for day, cloud for night — rather than by condition. A fuller icon set would allow mapping by condition instead.

**Search**

6.  Initial page load fetches the weather data from the most recent search result, with default fallback to Singapore. - Nothing was specified for a first visit, and empty weather data would look odd. Returning users see where they left off.
7.  Invalid city or country name message replaces the current weather data displayed - Followed the mockup implementation. An improvement suggestion would be to show the error message beneath the search bar instead.

**Search History**

8.  Search history persists across sessions using localStorage.
9.  Repeated searches of the same place will create separate entries.
10. The search history list is scrollable and has a capped number of entries - I have set a limit of only saving the most recent 30 entries.

**Misc**

11. Theme is user-toggleable and persisted with localStorage - First visit follows OS `prefers-color-scheme`. A semi-transparent toggle button is provided on the bottom left of the page.
12. Breakpoint for switching between desktop and mobile frame is set at 600px width. Fluid sizing handles the intermediate widths.
