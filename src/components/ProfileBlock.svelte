<script>
 import {auth} from '$stores/authStore';
 import {t} from '$stores/l10nStore';

</script>

<div class="flex max-w-90 p-6">
    <div class="avatar">
        <div class="w-24 mask mask-squircle">
            <img alt="avatar" src={$auth.google.profile?.picture} />
        </div>
    </div>
    <div class="pl-6">
        <h3 class="text-xl font-bold">
            {$auth.google.profile?.name ?? 'User Name'}
        </h3>
        <small>
            {$auth.google.profile?.email ?? 'useremail@examaple.com'}
        </small>
        <a class="btn btn-accent btn-sm mt-2" href="/user/edit">
            {$t('user.edit')}
        </a>
    </div>
</div>

<style>
</style>
