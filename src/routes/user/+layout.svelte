<script>
 // import {t} from '$stores/l10nStore';
 // import isMobile from '$lib/utils/isMobile';

</script>

<main class="md:grid grid-cols-12 grid-rows-6 bg-base7">
    <!-- <ul class="row-span-6 col-span-4 menu ml-auto pb-80 rounded-box flex justify-center">
         <li>
         <h2 class="menu-title">{$t('user.navTitle')}</h2>
         <ul>
         <li><a href="/user">{$t('route.account')}</a></li>
         <li><a href="/user/settings">{$t('route.settings')}</a></li>
         </ul>
         </li>
         </ul> -->
    <div class="row-span-6 col-span-8 flex flex-col items-center md:w-screen mx-2.5 h-fit">
        <slot />
    </div>
</main>
