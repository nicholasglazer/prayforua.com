<script>
 import {auth} from '$stores/authStore'

</script>

<div class="flex">
    <div>
        <h3>
            {$auth.user?.name}
        </h3>
        <h5>
            {$auth.user?.email}
        </h5>
    </div>
    <div class="avatar">
        <div class="w-24 mask mask-squircle">
            <img alt="avatar" src={$auth.user?.picture} />
        </div>
    </div>
</div>
<div class="divider"></div>

<style>
</style>
