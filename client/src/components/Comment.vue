<template>
    <div>
        {{ comment.content }}
        {{
            capitalizeFirst(comment.author.firstName) +
                ' ' +
                capitalizeFirst(comment.author.lastName)
        }}
    </div>
</template>

<script>
import stringMixin from '../mixins/stringMixin';
export default {
    name: 'Comment',
    props: ['comment'],
    mixins: [stringMixin]
};
</script>
