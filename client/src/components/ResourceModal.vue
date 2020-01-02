<template>
    <div class="tile is-child box">
        <article>
            <p class="title">
                {{ data.title }}
            </p>
            <p class="subtitle">
                nice
            </p>
        </article>
    </div>
</template>

<script>
export default {
    name: 'ResourceModal',
    props: ['data']
};
</script>
